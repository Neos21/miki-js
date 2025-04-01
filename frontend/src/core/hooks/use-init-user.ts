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
  
  return {
    fetchUser
  };
};
