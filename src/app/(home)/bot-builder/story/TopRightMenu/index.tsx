import { FC, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';

import VariableDialog from '../VariableDialog';
import styles from './index.module.scss';
import ChatBox from '@/components/ChatBox';
import { useUserStore } from '@/store';

import '@stylospectrum/ui/dist/icon/data/search';
import '@stylospectrum/ui/dist/icon/data/syntax';

const TopRightMenu: FC = () => {
  const user = useUserStore((state) => state.user);
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [varDialogVisible, setVarDialogVisible] = useState(false);

  return (
    <>
      <div className={styles.wrapper}>
        <Button icon="search" type={ButtonDesign.Tertiary} />
        <Button
          icon="syntax"
          type={ButtonDesign.Tertiary}
          onClick={() => setVarDialogVisible(true)}
        />
        <Button type={ButtonDesign.Secondary} onClick={() => setChatBoxVisible(true)}>
          Test your bot
        </Button>
      </div>

      {chatBoxVisible && (
        <ChatBox
          className={styles['chat-box']}
          showResetChat
          name="Bot"
          conversationId={'test-your-bot-' + user.id}
          onClose={() => setChatBoxVisible(false)}
        />
      )}

      {varDialogVisible && (
        <VariableDialog visible={varDialogVisible} onClose={() => setVarDialogVisible(false)} />
      )}
    </>
  );
};

export default TopRightMenu;
