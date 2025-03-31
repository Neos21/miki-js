import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';
import { useUserStore } from '../../shared/stores/use-user-store';

export const useInitUser = () => {
  const userStore = useUserStore();
  
  const fetchUser = async (): Promise<void> => {
    try {
      const storedUser = userStore.getUser();
      if(isEmptyObject(storedUser)) return console.log('The User Does Not Exist In The User Store (LocalStorage)');
      
      const response = await fetch(`/api/users/${storedUser.id}`, { method: 'GET' });
      const json: Result<User> = await response.json();
      if(json.error != null) return console.warn('Something Wrong', json);
      userStore.setUser(json.result);
      console.log('User Fetched', json);
    }
    catch(error) {
      console.error('Failed To Fetch User', error);
    }
  };
  
  const createUser = async (misskeyHost: string, misskeyHostUrl: string, sessionId: string): Promise<void> => {
    try {
      const miAuthResponse = await fetch(`${misskeyHostUrl}/api/miauth/${sessionId}/check`, { method: 'POST' });
      const miAuthJson = await miAuthResponse.json();
      if(!miAuthJson.ok) return console.warn('Failed To Check MiAuth', miAuthJson);
      
      // LocalStorage に保存する
      const user: User = {
        id             : `@${miAuthJson.user.username}@${misskeyHost}`,
        misskeyUserName: miAuthJson.user.username,
        misskeyHost    : misskeyHost,
        name           : miAuthJson.user.username,
        avatarUrl      : miAuthJson.user.avatarUrl,
        sessionId      : sessionId,
        token          : miAuthJson.token,
        misskeyUser    : miAuthJson.user
      };
      userStore.setUser(user);
      // DB にユーザを登録する
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const json = await response.json();
      console.log('User Created', json);
    }
    catch(error) {
      console.error('Failed To Create User', error);
    }
  };
  
  return {
    fetchUser,
    createUser
  };
};
