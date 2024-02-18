import { FC, useEffect, useRef, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import classNames from 'classnames';
import { io, type Socket } from 'socket.io-client';

import styles from './index.module.scss';
import ChatBoxInput from './Input';
import chatApi from '@/api/chat';
import { Message } from '@/model';
import { useUserStore } from '@/store';
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

  const handleEnter = (message: string) => {
    socket.current?.emit('chat', {
      message,
      conversationId: conversationId,
      sellerId: user.id,
      role: 'Seller',
    });
  };

  const handleResetChat = async () => {
    setMessages([]);
  };

  const handleClose = () => {
    socket.current?.disconnect();
    onClose();
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await chatApi.getMessages({
        conversationId,
        limit: 100,
      });
      setMessages(response);
    };
    fetchMessages();

    const url = process.env.NEXT_PUBLIC_API_URL!.replace('http://', '');
    const tokens = storage.getToken();

    socket.current = io(`ws://${url}`, {
      path: '/chat/socket.io',
      extraHeaders: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    socket.current!.connect();
    socket.current!.on('chat', (message) => {
      setMessages((prev) => [
        ...prev,
        new Message({
          content: message.content,
          senderId: message.senderId,
          id: message.id,
        }),
      ]);
    });

    return () => {
      socket.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div className={styles['message-container']}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={classNames({
                [styles['message-left']]: message.senderId !== user.id,
                [styles['message-right']]: message.senderId === user.id,
              })}
            >
              <div className={styles['message-box']}>
                <div className={styles['message-content']}>{message.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <ChatBoxInput onEnter={handleEnter} />
      </div>
    </div>
  );
};

export default ChatBox;
