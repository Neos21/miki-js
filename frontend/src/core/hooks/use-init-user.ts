import { camelToSnakeCaseObject, snakeToCamelCaseObject } from '../../common/helpers/convert-case';
import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { useUserStore } from '../../shared/stores/use-user-store';

import type { User, UserApi } from '../../common/types/user';
import type { Result } from '../../common/types/result';

export const useInitUser = () => {
  const userStore = useUserStore();
  
  const loadUser = async (): Promise<void> => {
    try {
      const storedUser = userStore.getUser();
      if(isEmptyObject(storedUser)) return console.log('The User Does Not Exist In The User Store (LocalStorage)');
      
      const response = await fetch(`/api/users/${storedUser.id}`, { method: 'GET' });  // Throws
      const json: Result<UserApi> = await response.json();  // Throws
      if(json.error != null) return console.warn('Something Wrong', json);
      const user: User = snakeToCamelCaseObject(json.result);
      userStore.setUser(user);
      console.log('User Loaded', user);
    }
    catch(error) {
      console.error('Failed To Load User', error);
    }
  }
  
  const createUser = async (misskeyHost: string, misskeyHostUrl: string, sessionId: string): Promise<void> => {
    try {
      const miAuthResponse = await fetch(`${misskeyHostUrl}/api/miauth/${sessionId}/check`, { method: 'POST' });  // Throws
      const json = await miAuthResponse.json();  // Throws
      if(!json.ok) return console.warn('Failed To Check MiAuth', json);
      
      // LocalStorage に保存する
      const user: User = {
        id             : `@${json.user.username}@${misskeyHost}`,
        misskeyUserName: json.user.username,
        misskeyHost    : misskeyHost,
        name           : json.user.username,
        avatarUrl      : json.user.avatarUrl,
        sessionId      : sessionId,
        token          : json.token,
        misskeyUser    : json.user
      };
      userStore.setUser(user);
      // DB にユーザを登録する
      const userApi: UserApi = camelToSnakeCaseObject(user);
      const postResponse = await fetch('/api/users', {  // Throws
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userApi)
      });
      const postResponseJson = await postResponse.json();  // Throws
      console.log('User Created', postResponseJson);
    }
    catch(error) {
      console.error('Failed To Create User', error);
    }
  };
  
  return {
    loadUser,
    createUser
  };
};
