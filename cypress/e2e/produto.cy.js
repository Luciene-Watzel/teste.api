/// <reference types="cypress" />
import contrato from '../contracts/produto.contracts'

describe('Teste da Funcionalidade Produtos', () => {
    let token
    beforeEach(() => {
        cy.token('lu.lima@qa.com.br', 'teste10').then(tkn => {token = tkn})
 });

 it.only('Deve validar contrato de produtos', () => {
    cy.request('produtos').then(response => {
        return contrato.validateAsync(response.body)
    })
    
 });

    
    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url:'produtos',
        }).then((response)=>{ 
        //expect(response.body.produtos[3].nome).to.equal('Fone de Ouvido 804976')
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('produtos')
        expect(response.duration).to.be.lessThan(20)
        })
    });

    it('Cadastrar produto', () => {
        let produto = `Fone de Ouvido ${ Math.floor(Math.random() * 1000000)}`
        cy.request({
            method: 'POST',
            url: 'produtos',
            headers: {authorization: token},
            body: {
                "nome": produto,
                "preco": 35,
                "descricao": "Fone",
                "quantidade": 200
              },
            
            }).then((response) =>{
                expect(response.status).to.equal(201)
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            })
        
    });

    it('Deve validar mesnagem de erro ao cadastrar produto repetido', () => {
     cy.CadastrarProduto(token, 'Fone de Ouvido 1', 35, 'Fone', 200 )
            
            .then((response) =>{
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
            }) 
    
         
        })

        it('Deve editar um produto já cadastrado', () => {
            let produto = `Fone de Ouvido ${ Math.floor(Math.random() * 1000000)}`
            cy.request('produtos').then(response=> {
                let id = response.body.produtos[0]._id
                cy.request({
                    method: 'PUT',
                    url:`produtos/${id}`,
                    headers: {authorization: token},
                    body: 
                    {
                        "nome": produto,
                        "preco": 35,
                        "descricao": "Fone de Ouvido",
                        "quantidade": 200
                      }
                }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
                })

            })
            
        });
        
        it('Deve editar um produto já cadastrado previamnte', () => {
            let produto = `Fone de Ouvido ${ Math.floor(Math.random() * 1000000)}`
            cy.CadastrarProduto(token, produto, 35, 'Fone', 200 )
            .then(response => {
                let id = response.body._id

                cy.request({
                    method: 'PUT',
                    url:`produtos/${id}`,
                    headers: {authorization: token},
                    body: 
                    {
                        "nome": produto,
                        "preco": 35,
                        "descricao": "Fone de Ouvido",
                        "quantidade": 200
                      }
                }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
                })

            })

            
        });

        it('Deve deletar um produto já cadastrado previamnete', () => {
            let produto = `Fone de Ouvido ${ Math.floor(Math.random() * 1000000)}`
            cy.CadastrarProduto(token, produto, 35, 'Fone', 200 )
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url:`produtos/${id}`,
                    headers: {authorization: token}
                }).then(response => {
                    expect(response.body.message).to.equal("Registro excluído com sucesso")
                    expect(response.status).to.equal(200)
                })
            })

            
        });
        

        
    });

