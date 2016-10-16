import { expect } from 'chai';

export const errorInstance = (res, message, path) => {
  expect(res).to.be.an.instanceOf(Error);
  expect(res.errors[0].message).to.equal(message);
  if (path) expect(res.errors[0].path).to.equal(path);
};
