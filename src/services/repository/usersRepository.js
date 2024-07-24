import Email from '../../helpers/email.js';

export default class UsersRepository {
  constructor(dao) { 
    this.dao = dao;
    this.email= new Email();
  };

  getUser = async (req) => {
    console.log(error);
  };

sendEmail = async(user, subject, web) => {
  const result = this.email.send(user, subject, web);
  return result
  };
}