import Dispatcher from './../../dispatcher';
import UserConstants from './../../constants/user';
import Store from 'utils/flux/store';
import Immutable from 'immutable';
import ImmutableHelper from 'utils/helpers/immutable';

// Hard code some initial data for the store
const data = {
  dialogOpen: false,
  name: "John Hancock",
  date_of_birth: "1980-01-23",
  address: "Sage UK\nNorth Park\nNewcastle upon Tyne"
};

class UserStore extends Store {
  constructor(Dispatcher) {
    super(Dispatcher);

    // provide a name for this store
    this.name = 'userStore';

    // define the data for this store
    this.data = ImmutableHelper.parseJSON(data);
  }

  /**
   * Subscribe this store to the following actions...
   */

  [UserConstants.USER_VALUE_UPDATED](action) {
    this.data = this.data.set(action.name, action.value);
  }

  [UserConstants.USER_DIALOG_OPENED](action) {
    this.data = this.data.set('dialogOpen', true);
  }

  [UserConstants.USER_DIALOG_CLOSED](action) {
    this.data = this.data.set('dialogOpen', false);
  }
}

export default new UserStore(Dispatcher);