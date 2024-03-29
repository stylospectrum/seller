import { FC, useEffect, useRef, useState } from 'react';
import { BusyIndicator, Button } from '@stylospectrum/ui';
import { BusyIndicatorSize, ButtonDesign } from '@stylospectrum/ui/dist/types';
import classNames from 'classnames';
import Image from 'next/image';
import { io, type Socket } from 'socket.io-client';

import ChatBoxGallery from './Gallery';
import styles from './index.module.scss';
import ChatBoxInput from './Input';
import { botBuilderStoryApi } from '@/api';
import { MessageType } from '@/enums';
import { Message } from '@/model';
import { useAuthStore, useUserStore } from '@/store';
import storage from '@/utils/storage';

import '@stylospectrum/ui/dist/icon/data/decline';
import '@stylospectrum/ui/dist/icon/data/reset';

interface ChatBoxProps {
  onClose: () => void;
  className: string;
  showResetChat?: boolean;
  name: string;
  conversationId: string;
}

const ChatBox: FC<ChatBoxProps> = ({ onClose, className, showResetChat, name, conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useUserStore((state) => state.user);
  const socket = useRef<Socket>();

  const handleChat = (message: string) => {
    socket.current?.emit('chat', {
      message,
      conversationId: conversationId,
      sellerId: user.id,
      role: 'Seller',
    });
  };

  const handleResetChat = async () => {
    socket.current?.disconnect();
    setMessages([]);
    socket.current!.connect();
  };

  const handleClose = () => {
    socket.current?.disconnect();
    onClose();
  };

  const handleButtonClick = async (goTo: string) => {
    const res = await botBuilderStoryApi.getUserInputs(goTo);

    if (res) {
      const userInput = res.userInputs[Math.floor(Math.random() * res.userInputs.length)];

      handleChat(userInput.content);
    }
  };

  useEffect(() => {
    const tokens = storage.getToken() || useAuthStore.getState();

    socket.current = io(process.env.NEXT_PUBLIC_API_URL!, {
      path: '/chat/socket.io',
      extraHeaders: { Authorization: `Bearer ${tokens.accessToken}` },
      secure: true,
    });
    socket.current!.connect();
    socket.current!.on('chat', (message) => {
      setMessages((prev) => {
        const removedTypingMsg = prev.filter((msg) => !msg.typing);

        return [
          ...removedTypingMsg,
          new Message({
            content: message.content,
            senderId: message.senderId,
            id: message.id,
            type: message.type,
            imgUrl: message.imgUrl,
            buttons: message.buttons,
            gallery: message.gallery,
          }),
        ];
      });
    });
    socket.current!.on('typing', (message) => {
      setMessages((prev) => [
        ...prev,
        new Message({
          id: message.id,
          typing: message.typing,
          senderId: message.senderId,
          content: '',
        }),
      ]);
    });

    return () => {
      socket.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMessage = (message: Message) => {
    if (message.typing) {
      return (
        <div className={styles['message-box']}>
          <div className={styles['message-content']}>
            <BusyIndicator size={BusyIndicatorSize.Small} />
          </div>
        </div>
      );
    }

    if (message.type === MessageType.Image) {
      return <Image src={message.imgUrl!} width={308} height={308} alt="" />;
    }

    if (message.type === MessageType.QuickReply) {
      return (
        <>
          <div className={styles['message-box']}>
            <div className={styles['message-content']}>{message.content}</div>
          </div>

          {message.buttons && (
            <div className={styles['message-button-container']}>
              {message.buttons.map((button, idx) => (
                <Button
                  key={`msg-button-${idx}`}
                  type={ButtonDesign.Secondary}
                  onClick={() => handleButtonClick(button.goTo)}
                >
                  {button.content}
                </Button>
              ))}
            </div>
          )}
        </>
      );
    }

    if (message.type === MessageType.Gallery) {
      return <ChatBoxGallery data={message.gallery || []} />;
    }

    return (
      <div className={styles['message-box']}>
        <div className={styles['message-content']}>{message.content}</div>
      </div>
    );
  };

  const renderMessageWrap = (message: Message, idx: number) => {
    let marginTop = messages?.[idx - 1]?.senderId === message.senderId ? '0.5rem' : '1rem';

    if (idx === 0) {
      marginTop = '0';
    }

    return (
      <div
        key={message.id}
        style={{
          marginTop,
        }}
        className={classNames({
          [styles['message-left']]: message.senderId !== user.id,
          [styles['message-right']]: message.senderId === user.id,
        })}
      >
        {renderMessage(message)}
      </div>
    );
  };

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.header}>
        <div className={styles['header-inner']}>
          <div className={styles.avatar}></div>
          <span className={styles.text}>{name}</span>
        </div>
        {showResetChat && (
          <Button type={ButtonDesign.Tertiary} onClick={handleResetChat} icon="reset"></Button>
        )}
        <Button type={ButtonDesign.Tertiary} icon="decline" onClick={handleClose}></Button>
      </div>

      <div className={styles.content}>
        <div className={styles['message-container']}>{messages.map(renderMessageWrap)}</div>
      </div>
      <div className={styles.footer}>
        <ChatBoxInput onEnter={handleChat} />
      </div>
    </div>
  );
};

export default ChatBox;
