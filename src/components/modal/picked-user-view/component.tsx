import * as React from 'react';
import { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { PickedUserViewComponentProps } from './types';
import * as Styled from './styles';

const intlMessages = defineMessages({
  currentUserPicked: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.title.currentUserPicked',
    description: 'Title to show that current user has been picked',
  },
  randomUserPicked: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.title.randomUserPicked',
    description: 'Title to show that random user has been picked',
  },
  backButtonLabel: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.backButton.label',
    description: 'Label of back button in picked-user view on the modal',
  },
});

export function PickedUserViewComponent(props: PickedUserViewComponentProps) {
  const {
    intl,
    pickedUserWithEntryId,
    currentUser,
    updatePickedRandomUser,
    setShowPresenterView,
    dispatcherPickedUser,
  } = props;

  useEffect(() => {
    if (currentUser?.presenter) {
      updatePickedRandomUser(pickedUserWithEntryId.entryId, {
        ...pickedUserWithEntryId.pickedUser,
        isPresenterViewing: true,
      });
    }
    return () => {
      if (currentUser?.presenter) {
        updatePickedRandomUser(pickedUserWithEntryId.entryId, {
          ...pickedUserWithEntryId.pickedUser,
          isPresenterViewing: false,
        });
      }
    };
  }, []);

  const handleBackToPresenterView = () => {
    if (currentUser?.presenter) {
      setShowPresenterView(true);
      dispatcherPickedUser(null);
    }
  };
  const avatarUrl = pickedUserWithEntryId.pickedUser.avatar;

  const title = (pickedUserWithEntryId?.pickedUser?.userId === currentUser?.userId)
    ? intl.formatMessage(intlMessages.currentUserPicked)
    : intl.formatMessage(intlMessages.randomUserPicked);
  return (
    <Styled.PickedUserViewWrapper>
      <Styled.PickedUserViewTitle>{title}</Styled.PickedUserViewTitle>
      {
        (pickedUserWithEntryId) ? (
          <>
            {avatarUrl ? (
              <Styled.PickedUserAvatarImage
                alt={`Avatar of user ${pickedUserWithEntryId.pickedUser.name}`}
                src={avatarUrl}
              />
            ) : (
              <Styled.PickedUserAvatarInitials
                background={pickedUserWithEntryId.pickedUser?.color}
              >
                {pickedUserWithEntryId.pickedUser?.name.slice(0, 2)}
              </Styled.PickedUserAvatarInitials>
            )}
            <Styled.PickedUserName>{pickedUserWithEntryId.pickedUser?.name}</Styled.PickedUserName>
          </>
        ) : null
      }
      {
        (currentUser?.presenter) ? (
          <button type="button" onClick={handleBackToPresenterView}>
            {intl.formatMessage(intlMessages.backButtonLabel)}
          </button>
        ) : null
      }
    </Styled.PickedUserViewWrapper>
  );
}
