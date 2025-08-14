import AccessControl from 'accesscontrol';
import Roles from './roles.js';
import Resources from './resources.js';

const ac = new AccessControl();

ac.grant(Roles.CUSTOMER)
    .readOwn(Resources.PROFILE)
    .updateOwn(Resources.PROFILE)
    .createOwn(Resources.TRANSACTION);


ac.grant(Roles.USER)
    .readOwn(Resources.USER)
    .updateOwn(Resources.USER)
    .readAny(Resources.CUSTOMER)
    .updateAny(Resources.CUSTOMER)
    .readAny(Resources.TRANSACTION);

ac.grant(Roles.ADMIN)
    .readAny(Resources.PROFILE)
    .updateAny(Resources.PROFILE)
    .updateAny(Resources.KYC)
    .readAny(Resources.TRANSACTION)
    .readAny(Resources.USER)
    .updateAny(Resources.USER)
    .createAny(Resources.USER)

ac.grant(Roles.SUPER_ADMIN)
    .readAny(Resources.PROFILE)
    .updateAny(Resources.PROFILE)
    .updateAny(Resources.KYC)
    .readAny(Resources.TRANSACTION)
    .readAny(Resources.USER)
    .updateAny(Resources.USER)
    .createAny(Resources.USER)


export default ac;