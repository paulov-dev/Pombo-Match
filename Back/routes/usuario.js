const express = require('express');
const router = express.Router();

// RETORNA TODOS OS USUARIOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensage: 'Usando o GET dentro da rotas de Usuários'
    });
});

// INSERE UM USUARIO
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o POST dentro da rota de Usuários'
    });
});

// RETORNA OS DADOS DE UM USUARIO
router.get('/:id_usuario', (req, res, next) => {

    const id = req.params.id_usuario

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'Você descobriu o ID especial!',
            id: id
        })
    } else {
        res.status(200).send({
            mensagem: 'usando o GET de um produto',
            id: id
        })
    }        

});

router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usnado o PATCH dentro da rota de usuarios'

    });
});

router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o DELETE dentro da rota de produtos'
    })
})

// CADASTRO DE UM NOVO USUÁRIO
router.post('/cadastro/:id_usuario', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usuário cadastrado com sucesso'
    })
});

module.exports = router