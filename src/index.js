let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function getToyData(toys) {
  return fetch(toys)
  .then(resp => resp.json())
}

getToyData('http://localhost:3000/toys')
  .then(data => importData(data))

//render toy cards
function renderToys(toy){
  const toyContainer = document.querySelector('#toy-collection');
  const div = document.createElement('div')
  div.className = 'card'
  toyContainer.append(div)
  const img = document.createElement('img');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');
  const btn = document.createElement('button')
  btn.id = 'toy_id'
  btn.className = 'like-btn'
  btn.textContent = 'Like!'
  img.className = 'toy-avatar'
  btn.addEventListener('click', event => {
    event.preventDefault()
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        likes: parseInt(event.target.parentElement.children[2].textContent, 10) +1
      })
    })
    .then(resp => resp.json())
    .then(data => {
      p.textContent = `${data.likes} likes`
    })
  })
  img.src = toy.image
  h2.textContent = toy.name
  p.textContent = `${toy.likes} likes!`
  div.appendChild(h2)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(btn)
}

//import data onto cards
function importData(data) {
  return data.forEach(toy => renderToys(toy))
}
  
 
//handle toy submit
function submitHandler(event) {
  const toyNameInput = event.target[0].value
  const toyUrlInput = event.target[1].value
  event.preventDefault()
   fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      'name': toyNameInput,
      'image': toyUrlInput,
      'likes': 0
    }) 
  })
  .then(resp => resp.json()) 
  .then(data => renderToys(data))
  document.querySelector('form').reset()
}

//submit event listener
 function submitListener(){
  const submitBtn = document.querySelector('form')
  submitBtn.addEventListener('submit', submitHandler)
 }
submitListener()
