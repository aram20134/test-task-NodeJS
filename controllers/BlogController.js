const ApiError = require("../error/ApiError");
const { Blog } = require("../models/models");
const uuid = require('uuid')
const path = require('path');
const fs = require("fs");

const checkMessage = (req) => {
  var message
  if (!req.body.message && req.files !== null) {
    message = req.files.message
    const fileExt = message.name.split('.').pop()
    const allowedFileExt = ['JPEG', 'JPG', 'PNG', 'GIF', 'MP4', 'WEBP']

    if (!allowedFileExt.includes(fileExt.toUpperCase())) {
      return next(ApiError.badRequest('Wrong extension of media'))
    }
    const fileName = uuid.v4() + '.' + message.name.split('.').pop()
    message.mv(path.resolve(__dirname, '..', 'static/blog', fileName))
    message = fileName
  } else {
    message = req.body.message
  }
  return message
}

const checkAndDel = (message) => {
  fs.stat(path.resolve(__dirname, '..', 'static/blog', message), (err, stats) => {
    if (err) return
    fs.unlinkSync(path.resolve(__dirname, '..', 'static/blog', message))
  })
}

class BlogController {
  async addBlog(req, res, next) {
    try {
      const { date } = req.body
      var message = checkMessage(req)
      const author = req.user.name

      if (!date || !message) {
        return next(ApiError.badRequest('Not all fields received'))
      }
      
      const blog = await Blog.create({date, message, author, userId: req.user.id})

      res.send({message: 'Blog created successfully', blog})
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest(e.message))
    }
  }
  async getBlogs(req, res, next) {
    try {
      const { page } = req.query

      if (!page) {
        return next(ApiError.badRequest('Page is not recieved'))
      }

      const limit = 20
      const offset = Number(page) === 1 ? 0 : limit * (page - 1)

      const blogs = await Blog.findAll({limit, offset})

      res.send(blogs)
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest(e.message))
    }
  }
  async delBlog(req, res, next) {
    try {
      const { id } = req.body
      const blog = await Blog.findOne({where: {id}})

      if (blog.userId === req.user.id) {
        await Blog.destroy({where: {id}})
        // fs.stat(path.resolve(__dirname, '..', 'static/blog', blog.message), (err, stats) => {
        //   if (err) return
        //   fs.unlinkSync(path.resolve(__dirname, '..', 'static/blog', blog.message))
        // })
        checkAndDel(blog.message)
      } else {
        return next(ApiError.forbiden('Not allowed'))
      }

      res.send({message: 'Blog deleted successfully'})
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest(e.message))
    }
  }
  async updateBlog(req, res, next) {
    try {
      const { id } = req.body
      const message = checkMessage(req)

      const oldBlog = await Blog.findOne({where:{id}})

      if (req.user.id === oldBlog.userId) {
        await Blog.update({message}, {where:{id}}) 
        checkAndDel(oldBlog.message)
      }
      var newBlog = await Blog.findOne({where:{id}})
      res.send({message: 'Blog updated successfully', blog: newBlog})
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new BlogController()