const request = require('supertest')
const app = require('../app')

describe('Get OK', () => {
    it('should get a OK', async () => {
      const res = await request(app)
        .get('/')
      expect(res.statusCode).toEqual(200)
      expect(res.body.msg == "OK")
    });
})
describe('Login', () => {
    it('should login and get token', async () => {
      const res = await request(app)
        .post('/api/v1/employees/login')
        .send({
          email: "admin@gmail.com",
          password: '123456',
        });
      expect(res.statusCode).toEqual(200)
      expect(res.body.token.length)
    });
    it('should not login and get error', async () => {
      const res = await request(app)
        .post('/api/v1/employees/login')
        .send({
          email: "admin@gmail.com",
          password: '654321',
        });
      expect(res.statusCode).toEqual(400)
    });
})
describe('Get products', () => {
    it('should get products list', async () => {
      const res = await request(app)
        .get('/api/v1/products')
      expect(res.statusCode).toEqual(200)
      expect(typeof(res.body)=='object')
    });
    it('should get coffee', async () => {
      const res = await request(app)
        .get('/api/v1/products/61cfff61e6778fa17a69371e')
      expect(res.statusCode).toEqual(200)
      expect(typeof(res.body)=='object')
      expect(res.body.name == "Cà Phê Đen Đá (Size L)")
    });
    it('should get tea', async () => {
      const res = await request(app)
        .get('/api/v1/products/61cfff62e6778fa17a693743')
      expect(res.statusCode).toEqual(200)
      expect(typeof(res.body)=='object')
      expect(res.body.name == "Trà Chanh Việt Quất")
    });
})
describe('Get employees', () => {
    it('should get employees list', async () => {
      const res = await request(app)
        .get('/api/v1/employees')
      expect(res.statusCode).toEqual(200)
      expect(typeof(res.body)=='object')
    });
    it('should get employees info', async () => {
      const res = await request(app)
        .get('/api/v1/employees/61d02712ca377a65448b8b0c')
      expect(res.statusCode).toEqual(200)
      expect(typeof(res.body)=='object')
    });
    it('should not get employees info', async () => {
      const res = await request(app)
        .get('/api/v1/employees/61d02712cas77a65448b8b0c')
      expect(res.statusCode).toEqual(404)
    });
})
describe('Get 404', () => {
    it('should return status code 404', async () => {
      const res = await request(app)
        .get('/random')
      expect(res.statusCode).toEqual(404);
      expect(res.body.err == "Path not found")
    });
})