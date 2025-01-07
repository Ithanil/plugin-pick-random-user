import { CurrentUserData, DeleteEntryFunction } from 'bigbluebutton-html-plugin-sdk';
import { DataChannelEntryResponseType, PushEntryFunction, ReplaceEntryFunction } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import { PickedUser, PickedUserWithEntryId } from '../pick-random-user/types';

export interface PickUserModalProps {
  showModal: boolean;
  updatePickedRandomUser: ReplaceEntryFunction<PickedUser>;
  handleCloseModal: () => void;
  users?: PickedUser[];
  pickedUserWithEntryId: PickedUserWithEntryId;
  handlePickRandomUser: () => void;
  currentUser: CurrentUserData;
  filterOutPresenter: boolean,
  setFilterOutPresenter: (filter: boolean) => void,
  userFilterViewer: boolean;
  setUserFilterViewer: (filter: boolean) => void;
  filterOutPickedUsers: boolean,
  setFilterOutPickedUsers: (filter: boolean) => void,
  dataChannelPickedUsers?: DataChannelEntryResponseType<PickedUser>[];
  deletionFunction: DeleteEntryFunction;
  dispatcherPickedUser: PushEntryFunction;
}
