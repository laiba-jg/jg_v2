import AccessControl from 'accesscontrol';
import Roles from './roles';
import Resources from './resources';

const ac = new AccessControl();

ac.grant(Roles.CUSTOMER)
    .readOwn(Resources.PROFILE)
    .updateOwn(Resources.PROFILE)
    .createOwn(Resources.TRANSACTION);

ac.grant(Roles.ADMIN)
    .readAny(Resources.PROFILE)
    .updateAny(Resources.PROFILE)
    .updateAny(Resources.KYC);

ac.grant(Roles.SUPER_ADMIN)
    .readAny(Resources.PROFILE)
    .updateAny(Resources.PROFILE)
    .updateAny(Resources.KYC);


export default ac;