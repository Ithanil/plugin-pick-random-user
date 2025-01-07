import * as React from 'react';
import { useEffect } from 'react';

import { ActionButtonDropdownOption, ActionButtonDropdownSeparator } from 'bigbluebutton-html-plugin-sdk';
import { ActionButtonDropdownManagerProps } from './types';

function ActionButtonDropdownManager(props: ActionButtonDropdownManagerProps): React.ReactNode {
  const {
    pickedUserWithEntryId,
    currentUser,
    pluginApi,
    setShowModal,
    currentUserInfo,
  } = props;

  useEffect(() => {
    if (currentUser?.presenter) {
      pluginApi.setActionButtonDropdownItems([
        new ActionButtonDropdownSeparator(),
        new ActionButtonDropdownOption({
          label: 'Pick random user',
          icon: 'user',
          tooltip: '',
          allowed: true,
          onClick: () => {
            setShowModal(true);
          },
        }),
      ]);
    } else if (!currentUser?.presenter && pickedUserWithEntryId) {
      pluginApi.setActionButtonDropdownItems([
        new ActionButtonDropdownSeparator(),
        new ActionButtonDropdownOption({
          label: 'Display last randomly picked user',
          icon: 'user',
          tooltip: '',
          allowed: true,
          onClick: () => {
            setShowModal(true);
          },
        }),
      ]);
    } else {
      pluginApi.setActionButtonDropdownItems([]);
    }
  }, [currentUserInfo, pickedUserWithEntryId]);
  return null;
}

export default ActionButtonDropdownManager;
