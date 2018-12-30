const btns = document.querySelectorAll('button')
const form = document.querySelector('form')
const formAct = document.querySelector('form span')
const input = document.querySelector('input')
const error = document.querySelector('.error')

var activity = 'Bench';



btns.forEach(btn => {
    btn.addEventListener('click', e => {
        //get act
        activity = e.target.dataset.activity
        //remove and add actvity class

        btns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        // set id of input form

        input.setAttribute('id', activity);
        //set text of form span

        formAct.textContent = activity;

        //call update function 
        update(data);


    })
});

form.addEventListener('submit', e => {
    e.preventDefault();
    const amount  = parseInt(input.value);
    if(amount){
        db.collection('lifts').add({
            amount, 
            activity, 
            date: new Date().toString()
        }).then(() => {
            error.textContent =''
            input.value = ''
        })
    } else {
        error.textContent = 'Enter a amount'
    }


})