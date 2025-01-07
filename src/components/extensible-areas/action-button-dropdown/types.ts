import { CurrentUserData, GraphqlResponseWrapper, PluginApi } from 'bigbluebutton-html-plugin-sdk';
import { PickedUserWithEntryId } from '../../pick-random-user/types';

export interface ActionButtonDropdownManagerProps {
    pickedUserWithEntryId: PickedUserWithEntryId;
    currentUser: CurrentUserData;
    pluginApi: PluginApi;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    currentUserInfo: GraphqlResponseWrapper<CurrentUserData>;
}
