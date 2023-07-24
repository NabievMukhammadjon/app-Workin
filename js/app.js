document.addEventListener('DOMContentLoaded', () => {
    let users = [];
    
    const $userList = document.getElementById('user-list');

    function newUserTR(user) {
        const $userTR = document.createElement('tr'),
              $idTD = document.createElement('td'),
              $fioTD = document.createElement('td'),
              $emailTD = document.createElement('td'),
              $deleteBtnTD = document.createElement('td');
    
        $idTD.textContent = user.id;
        $fioTD.textContent = user.fio;
        $emailTD.textContent = user.email;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('user-btn__delete');
        deleteBtn.textContent = 'Удалить';
        $deleteBtnTD.append(deleteBtn);
        
        $userTR.append($idTD);
        $userTR.append($fioTD);
        $userTR.append($emailTD);
        $userTR.append($deleteBtnTD);
        
        deleteBtn.addEventListener('click', () => {
            if(confirm('Вы уверены?')) {
                $userTR.remove();
            }

            for (let i = 0; i < users.length; i++) {
                if (users[i].id == user.id) {
                    users.splice(i, 1); // .splice() это фун-я которая удоляет элемент
                }
            }

            saveList(users, 'Пользователи');
            render();
        })

        return $userTR;    
    }

    document.getElementById('add-student').addEventListener('submit', function(e) {
        e.preventDefault();

        const surname = document.getElementById('input-surname'),
              name = document.getElementById('input-name'),
              email = document.getElementById('input-email');
        
        const res = validation(this);
        
        if (res.result == true) {
            let fioUser = `${surname.value} ${name.value}`;
            
            const newUser = {
                id: getNewId(users),
                fio: fioUser,
                email: email.value
            };
            
            users.push(newUser);
            
            saveList(users, 'Пользователи')
            render();
            
            res.allInputs.forEach(element => {
                element.value = '';
            });

        }

    });
    
    function render() {
        $userList.innerHTML = '';

        let localData = localStorage.getItem('Пользователи');  
        if  (localData !== null && localData !== '') {
            users = JSON.parse(localData);
        }

        let usersCopy = [...users];
        // console.log(usersCopy)
        for (const user of usersCopy) {
            $userList.append(newUserTR(user));
        }
    }
    render()
    
    function validation(form) {
        function removeError(input) {
            const parent = input.parentNode;
    
            if (parent.classList.contains('error')) {
                parent.querySelector('.error-label').remove()
                parent.classList.remove('error')
            }
        }
    
        function createError(input, text) {
            const parent = input.parentNode;
            const errorLabel = document.createElement('label')
    
            errorLabel.classList.add('error-label')
            errorLabel.textContent = text;
            parent.classList.add('error')
    
            parent.append(errorLabel)
        }
    
        let result = true;
    
        const allInputs = form.querySelectorAll('input');
    
        for (const input of allInputs) {
    
            removeError(input)
    
            if (input.dataset.minLength) {
                if (input.value.length < input.dataset.minLength) {
                    removeError(input)
                    createError(input, `Минимальное кол-во символов: ${input.dataset.minLength}`)
                    result = false
                }
            }
    
            if (input.dataset.maxLength) {
                if (input.value.length > input.dataset.maxLength) {
                    removeError(input)
                    createError(input, `Максимальное кол-во символов: ${input.dataset.maxLength}`)
                    result = false
                }
            }
    
            if (input.dataset.required == "true") {
                if (input.value == "") {
                    removeError(input)
                    createError(input, 'Поле не заполнено!')
                    result = false
                }
            }
    
        }
    
        return {
            result,
            allInputs
        }
    }
    
    function getNewId(arr) {
        let max = 100;
        for(const item of arr) {
            if(item.id > max) {
                max = item.id
            }
        }
        return max + 1; 
    }

    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    }
});