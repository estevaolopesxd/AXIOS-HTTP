
const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

// config global axios
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'





// adiciona um interceptor antes da requesição
axios.interceptors.request.use(function (config) {
  // config.headers.common.Authorization = 'Token'

    return config
},
    function (error) {
        console.log("error")

        return Promise.reject(error)
    })




// adiciona um interceptor a resposta da requisição
axios.interceptors.response.use(function (response) {
    console.log('sucesso')
    // quando qualquer response tiver com status 200 cai aqui

    return response
}), function (error) {
    console.log(error.response)

    // quando qualquer response não tiver com status 200 cai aqui
    return Promise.reject(error)
}






















// method get
const get = () => {

    //config set quantos docs vai buscar
    const config = {
        params: {
            _limit: 5
        }
    }

    axios.get('posts', config)
        .then((response) => {
            renderOutput(response)
            console.log(response)

        })
}



// method post
const post = () => {

    //data obj que vai enviar
    const data = {
        title: 'Estevão',
        body: "Lopes",
        userId: 1,
    }



    axios.post('posts', data)
        .then((response) => renderOutput(response))

}


// method put
const put = () => {

    // igual ao post, o put precisa passar o corpo que irá fazer o update
    const data = {
        id: 1,
        title: 'Estevão',
        body: "Correia",
        userId: 1,
    }

    axios.put('posts/1', data) //precisa passar o id do post para realizar o update
        .then((response) => renderOutput(response))

}





// method patch
const patch = () => {

    // diferente do put, o patch ele atualiza somente alguns campos escolhidos
    const data = {
        title: 'Estevão',
    }


    axios.put('posts/1', data)
        .then((response) => renderOutput(response))

}





// method delete
const del = () => {
    axios.delete('posts/2')
        .then((response) => renderOutput(response))
}






// method multiple
const multiple = () => {
    // aguarda a promisse de buscar todas as requisições para realizar a ação
    Promise.all([
        axios.get('posts?_limit=5'),
        axios.get('users?_limit=5')
    ])
        .then((response) => {
            console.table(response[0].data)
            console.table(response[1].data)
        })

    console.log('multiple');
}




// method tramsform
const transform = () => {
    //config set quantos docs vai buscar
    const config = {
        params: {
            _limit: 5
        },

        //transforma a responta em uma string
        transformResponse: [function (data) {
            //  transforma a resposta em json
            // aqui  também posso usar o json como preferir
            const payload = JSON.parse(data).map(o => {
                return {
                    ...o,
                    firts_name: 'Estevão',
                    last_name: 'Lopes',
                    full_name: 'Estevão Lopes'
                }
            })

            return payload
        }]
    }

    axios.get('posts', config)
        .then((response) => renderOutput(response))
}





// method error
const errorHandling = () => {
    //forçando um erro com o link da requisição, para verificar possiveis erros. 
    axios.get('postsz')
        .then((response) => renderOutput(response))
        .catch((error) => renderOutput(error.response))
}






// method cancel
const cancel = () => {
    const controller = new AbortController() // abortController, é nativo js


    const config = {
        params: {
            _limit: 5
        },
        signal: controller.signal
    }

    axios.get('posts', config)
        .then((response) => renderOutput(response))
        .catch((e) => {
            console.log(e.message)
        })

    controller.abort() // cancelando requisição
}



const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}






const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);