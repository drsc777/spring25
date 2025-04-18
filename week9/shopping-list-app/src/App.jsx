import { useState } from 'react'
import './App.css'
import ShoppingList from './ShoppingList'

function App() {
  const [shoppingList, setShoppingList] = useState([])
  const [budget] = useState(100)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'grocery', 'school', 'electronics', 'clothing']

  const addItem = (event) => {
    event.preventDefault()
    let form = event.target
    let formData = new FormData(form)
    let formDataObj = Object.fromEntries(formData.entries())
    formDataObj.purchased = false
    formDataObj.cost = parseFloat(formDataObj.cost || 0)
    formDataObj.category = formDataObj.category || 'grocery'
    formDataObj.dueDate = formDataObj.dueDate || ''
    setShoppingList([...shoppingList, formDataObj])
    form.reset()
  }

  const removeItem = (event) => {
    const name = event.target.value
    setShoppingList(shoppingList.filter(item => item.name !== name))
  }

  const filteredList = selectedCategory === 'all' 
    ? shoppingList 
    : shoppingList.filter(item => item.category === selectedCategory)

  return (
    <>
      <h1>Shopping List Manager</h1>
      <div className='card'>
        <form onSubmit={addItem} className='flex-apart'>
          <input type="text" name="name" placeholder='Add item to list...' required />
          <input type="number" name="cost" placeholder='Cost' step="0.01" min="0" required />
          <select name="category" className='select-input'>
            <option value="grocery">Grocery</option>
            <option value="school">School</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
          <input type="date" name="dueDate" className='date-input' />
          <button className='btn purple' type='submit'>Add</button>
        </form>
      </div>
      <div className='category-filter'>
        {categories.map(category => (
          <button 
            key={category}
            className={`btn ${selectedCategory === category ? 'purple' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      <ShoppingList
        shoppingList={filteredList}
        removeItem={removeItem}
        budget={budget}
      />
    </>
  )
}

export default App
