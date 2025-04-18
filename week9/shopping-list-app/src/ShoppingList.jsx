function ShoppingList({ shoppingList, removeItem, budget }) {
  const totalSpent = shoppingList.reduce((acc, item) => acc + Number(item.cost), 0);
  const remainingBudget = budget - totalSpent;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <h2>Remaining Budget: ${remainingBudget.toFixed(2)}</h2>
      {shoppingList.map((val, index) => (
        <div
          className={val.purchased ? 'card flex-apart green' : 'card flex-apart'}
          key={index}
        >
          <div className="item-info">
            <span className="item-name">{val.name}</span>
            <span className="item-category">{val.category}</span>
            {val.dueDate && (
              <span className="item-date">Due: {formatDate(val.dueDate)}</span>
            )}
          </div>
          <div className="item-actions">
            <span className="item-cost">${val.cost.toFixed(2)}</span>
            <button className='btn' onClick={removeItem} value={val.name}>x</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default ShoppingList; 