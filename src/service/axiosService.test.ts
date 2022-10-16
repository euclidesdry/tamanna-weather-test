import axiosInstanceService from './axiosService';

let serviceInstance: typeof axiosInstanceService;

describe('AxiosService', () => {
  serviceInstance = axiosInstanceService;

  test('should be an axios instance', () => {
    expect(typeof serviceInstance).toBe('object');
    expect(serviceInstance.instance).toHaveProperty('request');
    expect(serviceInstance.instance).toHaveProperty('defaults');
    expect(serviceInstance.instance).toHaveProperty('create');
    expect(serviceInstance.instance).toHaveProperty('interceptors');
  });

  test('should have a function handleSuccess()', () => {
    expect(typeof serviceInstance.handleSuccess).toBe('function');
  });

  test('should have a function handleError()', () => {
    expect(typeof serviceInstance.handleError).toBe('function');
  });

  test('should have a function get()', () => {
    expect(typeof serviceInstance.get).toBe('function');
  });

  test('should have a function post()', () => {
    expect(typeof serviceInstance.post).toBe('function');
  });

  test('should have a function patch()', () => {
    expect(typeof serviceInstance.patch).toBe('function');
  });

  test('should have a function delete()', () => {
    expect(typeof serviceInstance.delete).toBe('function');
  });
});
