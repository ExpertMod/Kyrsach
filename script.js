




const ingridients = [
  {
    base: {
      label: 'Основа Сырная - 10',
      price: 10,
    },
    firstIngridient: {
      label: 'Инг. Свинина - 11',
      price: 11,
    },
    secondIngridient: {
      label: 'Инг. Говядина - 12',
      price: 12,
    },
    sauce: {
      label: 'Томатный соус - 13',
      price: 13,
    },
  },
  {
    base: {
      label: 'Основа Мясная - 14',
      price: 14,
    },
    firstIngridient: {
      label: 'Инг. Бекон - 15',
      price: 15,
    },
    secondIngridient: {
      label: 'Инг. Помидоры - 16',
      price: 16,
    },
    sauce: {
      label: 'Сливочный соус -17',
      price: 17,
    },
  },
  {
    base: {
      label: 'Основа Чесночная - 18',
      price: 18,
    },
    firstIngridient: {
      label: 'Инг. Майонез 19',
      price: 19,
    },
    secondIngridient: {
      label: 'Инг. Базилик - 20',
      price: 20,
    },
    sauce: {
      label: 'Сметанный соус - 21',
      price: 21,
    },
  },
  {
    base: {
      label: 'Основа Томатная - 22',
      price: 22,
    },
    firstIngridient: {
      label: 'Инг. Орегано - 23',
      price: 23,
    },
    secondIngridient: {
      label: 'Инг. Шпрот - 24',
      price: 24,
    },
    sauce: {
      label: 'Сырный соус - 25',
      price: 25,
    },
  },
];
let selectedItems = {};

const orderBtn = document.querySelector('.order-btn');
orderBtn.addEventListener('click', () => {
  const totalPrice = Object.values(selectedItems).reduce((accum, row) => {
    accum += row.reduce((accum, cell) => accum + cell.price, 0);
    
    return accum;
  }, 0);
  const pizzaWrapper = document.querySelector('.pizza-wrapper');
  const keys = Object.values(selectedItems).reduce((accum, items) => {
    return accum.concat(items.map(item => item.key));
  }, []);
  const uniqueKeys = [...new Set(keys)];
  //вывод заказа и суммы
  alert(`Ваш заказ на сумму: ${totalPrice}$, подтверждён `);
  console.log(`Ваш заказ: ${uniqueKeys.join(', ')}. Всего: $${totalPrice}`);
});

const renderPrice = (selectedItems) => {
  const priceElem = document.querySelector('.price span');
  const totalPrice = Object.values(selectedItems).reduce((accum, row) => {
    accum += row.reduce((accum, cell) => accum + cell.price, 0);

    return accum;
  }, 0);
  priceElem.innerHTML = `$${totalPrice}`;
}

const renderOrderReview = (selectedItems) => {
  const priceElem = document.querySelector('.order-review');
  priceElem.innerHTML = '';

  const orderLabels = Object.values(selectedItems).reduce((accum, items) => {
    return accum.concat(items.map(item => item.label));
  }, [])

  orderLabels.forEach(label => {
    const orderLabel = document.createElement('div');

    orderLabel.classList.add('order-label');
    orderLabel.innerHTML = label;
    priceElem.append(orderLabel);
  });
}

const renderPizza = (selectedItems) => {
  const pizzaWrapper = document.querySelector('.pizza-wrapper');
  const keys = Object.values(selectedItems).reduce((accum, items) => {
    return accum.concat(items.map(item => item.key));
  }, []);
  const uniqueKeys = [...new Set(keys)];

  pizzaWrapper.innerHTML = '';

  uniqueKeys.forEach(_ => {
    const pizzaPiece = document.createElement('div');

    pizzaPiece.classList.add('pizza-piece');
    pizzaWrapper.append(pizzaPiece);
  });
}

const renderIngridientsTable = () => {
  const ingridientsTableTbody = document.querySelector('.ingridients-table tbody');

  ingridientsTableTbody.innerHTML = '';
  ingridients.forEach((ingridient, rowIndex) => {
    const tr = document.createElement('tr');

    Object.entries(ingridient).forEach(([key, ingridientItem]) => {
      const td = document.createElement('td');

      if (selectedItems[rowIndex]?.find(item => item.key === key)) {
        td.classList.add('selected');
      } else {
        td.classList.remove('selected');
      }

      td.innerHTML = ingridientItem.label;
      td.addEventListener('click', () => {
        if (!selectedItems[rowIndex]) {
          selectedItems[rowIndex] = [];
        }

        if (selectedItems[rowIndex].find(item => item.key === key)) {
          selectedItems[rowIndex] = selectedItems[rowIndex].filter(item => item.key !== key);
        } else {
          // Если выбрана основа или соус
          if (['base', 'sauce'].includes(key)) {
            const selectedItemsNumber = Object.values(selectedItems).reduce((accum, items) => {
              return accum + items?.reduce((accum, item) => {
                if (item.key === key) {
                  return accum + 1;
                }

                return accum;
              }, 0)
            }, 0);

            if (selectedItemsNumber) {
              selectedItems = Object.values(selectedItems).map((items) => {
                const itemIndex = items?.findIndex((item) => item.key === key);

                return items.filter((item, index) => index !== itemIndex);
              });
            }
          }

          // Если выбраны ингридент(1 или 2)
          if (['firstIngridient', 'secondIngridient'].includes(key)) {
            const selectedItemsNumber = Object.values(selectedItems).reduce((accum, items) => {
              return accum + items?.reduce((accum, item) => {
                if (item.key === key) {
                  return accum + 1;
                }

                return accum;
              }, 0)
            }, 0);

            if (selectedItemsNumber === 2) {
              selectedItems = Object.values(selectedItems).map((items) => {
                const itemIndex = items?.findIndex((item) => item.key === key);

                return items.filter((item, index) => index !== itemIndex);
              });
            }
          }

          selectedItems[rowIndex]?.push({
            key,
            ...ingridientItem,
          });
        }

        renderIngridientsTable();
        renderPrice(selectedItems);
        renderOrderReview(selectedItems);
        renderPizza(selectedItems);
      });
      tr.append(td);
    });

    ingridientsTableTbody.append(tr);
  });
}

renderIngridientsTable();