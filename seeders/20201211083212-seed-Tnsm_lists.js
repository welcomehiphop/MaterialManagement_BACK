'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    data.map(item=>{
      item.created_at = new Date()
      item.updated_at = new Date()
    })
    return queryInterface.bulkInsert('M_tnsm_lists', data, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('M_tnsm_lists', null, {})
  }
}

const data = [
  {
    "system_name" : "Arduino Sensor Kit V5.0",
    "system_group": "product_10.jpg",
    "author_name" : "hatsanai",
    "description" : "my system is good",
    "url_system"  : "www.google.com",
    "img_system"  : "this is img link "
  }
]