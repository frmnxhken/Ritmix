export default class Store {
  constructor(storeName) {
    this.storeName = storeName
    this.storage = JSON.parse(localStorage.getItem(this.storeName)) || []
  }
  
  get() {
    return this.storage;
  }
  
  getBy(param, value) {
    return this.storage.filter(item => item[param].toLowerCase().includes(value.toLowerCase()))
  }
  
  insert(data) {
    this.storage.push(data)
    localStorage.setItem(this.storeName, JSON.stringify(this.storage)) 
    return this.storage
  }
  
  update(key, value, data = null) {
    this.index = this.storage.findIndex(item => item[key] === value)
    this.item = this.storage[this.index]
    console.log(this.storage[this.index])
    Object.keys(this.item).forEach((k, i) => {
      this.item[k] = data[k] ?? this.item[k]
      }
    )
    this.storage[this.index] = this.item
    localStorage.setItem(this.storeName, JSON.stringify(this.storage)) 
  }
  
  delete(key, value) {
    this.index = this.storage.findIndex(item => item[key] === value)
    this.storage.splice(this.index, 1)
  }
}