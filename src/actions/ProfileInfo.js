import { createAction } from 'redux-actions';

export const profileInfoActions = {
    PROFILE_INFO_REQUEST: 'ProfileInfo Requested!',
    PROFILE_INFO_SUCCESS: 'ProfileInfo successfully!',
    PROFILE_INFO_FAILED: 'ProfileInfo failed!',
    PROFILE_INFO_START: 'ProfileInfo Started!'
}

export const profileInfoRequest = createAction(profileInfoActions.PROFILE_INFO_REQUEST);
export const profileInfoStarted = createAction(profileInfoActions.PROFILE_INFO_START);
export const profileInfoSuccess = createAction(profileInfoActions.PROFILE_INFO_SUCCESS);
export const profileInfoFailed = createAction(profileInfoActions.PROFILE_INFO_FAILED);
