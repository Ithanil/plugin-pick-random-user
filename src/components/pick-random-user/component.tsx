import * as React from 'react';
import { useState, useEffect } from 'react';

import { BbbPluginSdk, PluginApi } from 'bigbluebutton-html-plugin-sdk';
import {
  ModalInformationFromPresenter,
  PickRandomUserPluginProps,
  PickedUser,
  UsersMoreInformationGraphqlResponse,
} from './types';
import { USERS_MORE_INFORMATION } from './queries';
import { PickUserModal } from '../modal/component';
import { Role } from './enums';
import ActionButtonDropdownManager from '../extensible-areas/action-button-dropdown/component';

function PickRandomUserPlugin({ pluginUuid: uuid }: PickRandomUserPluginProps) {
  BbbPluginSdk.initialize(uuid);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pickedUser, setPickedUser] = useState<PickedUser | undefined>();
  const [userFilterViewer, setUserFilterViewer] = useState<boolean>(true);
  const [filterOutPresenter, setFilterOutPresenter] = useState<boolean>(true);
  const [filterOutPickedUsers, setFilterOutPickedUsers] = useState<boolean>(true);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);
  const currentUserInfo = pluginApi.useCurrentUser();
  const { data: currentUser } = currentUserInfo;
  const allUsersInfo = pluginApi
    .useCustomSubscription<UsersMoreInformationGraphqlResponse>(USERS_MORE_INFORMATION);
  const { data: allUsers } = allUsersInfo;

  const {
    data: pickedUserFromDataChannelResponse,
    pushEntry: pushPickedUser,
    deleteEntry: deletePickedUser,
  } = pluginApi.useDataChannel<PickedUser>('pickRandomUser');
  const {
    data: modalInformationFromPresenter,
    pushEntry: dispatchModalInformationFromPresenter,
  } = pluginApi.useDataChannel<ModalInformationFromPresenter>('modalInformationFromPresenter');

  const pickedUserFromDataChannel = {
    data: pickedUserFromDataChannelResponse?.data,
    loading: false,
  };

  useEffect(() => {
    const modalInformationList = modalInformationFromPresenter
      .data;
    const modalInformation = modalInformationList
      ? modalInformationList[modalInformationList.length - 1]?.payloadJson : null;
    if (modalInformation) {
      setFilterOutPresenter(modalInformation.skipPresenter);
      setUserFilterViewer(modalInformation.skipModerators);
      setFilterOutPickedUsers(!modalInformation.includePickedUsers);
    }
  }, [modalInformationFromPresenter]);

  const usersToBePicked: UsersMoreInformationGraphqlResponse = {
    user: allUsers?.user.filter((user) => {
      let roleFilter = true;
      if (userFilterViewer) roleFilter = user.role === Role.VIEWER;
      if (filterOutPickedUsers && pickedUserFromDataChannel.data) {
        return roleFilter && pickedUserFromDataChannel
          .data.findIndex(
            (u) => u?.payloadJson?.userId === user?.userId,
          ) === -1;
      }
      return roleFilter;
    }).filter((user) => {
      if (filterOutPresenter) return !user.presenter;
      return true;
    }),
  };

  const handlePickRandomUser = () => {
    if (usersToBePicked && usersToBePicked.user.length > 0 && currentUser?.presenter) {
      const randomIndex = Math.floor(Math.random() * usersToBePicked.user.length);
      const randomlyPickedUser = usersToBePicked.user[randomIndex];
      pushPickedUser(randomlyPickedUser);
    }
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    if (currentUser?.presenter) {
      dispatchModalInformationFromPresenter({
        skipModerators: userFilterViewer,
        skipPresenter: filterOutPresenter,
        includePickedUsers: !filterOutPickedUsers,
      });
      pushPickedUser(null);
    }
    setShowModal(false);
  };

  useEffect(() => {
    if (pickedUserFromDataChannel.data
      && pickedUserFromDataChannel.data?.length > 0) {
      const pickedUserToUpdate = pickedUserFromDataChannel
        .data[0];
      setPickedUser(pickedUserToUpdate?.payloadJson);
      if (pickedUserToUpdate?.payloadJson) setShowModal(true);
    } else if (pickedUserFromDataChannel.data
        && pickedUserFromDataChannel.data?.length === 0) {
      setPickedUser(null);
      if (currentUser && !currentUser.presenter) setShowModal(false);
    }
  }, [pickedUserFromDataChannelResponse]);

  useEffect(() => {
    if (!pickedUser && !currentUser?.presenter) setShowModal(false);
  }, [pickedUser]);

  useEffect(() => {
    if (!currentUser?.presenter && dispatchModalInformationFromPresenter) handleCloseModal();
  }, [currentUser]);
  return (
    <>
      <PickUserModal
        {...{
          showModal,
          handleCloseModal,
          users: usersToBePicked?.user,
          pickedUser,
          handlePickRandomUser,
          currentUser,
          filterOutPresenter,
          setFilterOutPresenter,
          userFilterViewer,
          setUserFilterViewer,
          filterOutPickedUsers,
          setFilterOutPickedUsers,
          dataChannelPickedUsers: pickedUserFromDataChannel.data,
          dispatcherPickedUser: pushPickedUser,
          deletionFunction: deletePickedUser,
        }}
      />
      <ActionButtonDropdownManager
        {...{
          pickedUser,
          currentUser,
          pluginApi,
          setShowModal,
          currentUserInfo,
        }}
      />
    </>
  );
}

export default PickRandomUserPlugin;
