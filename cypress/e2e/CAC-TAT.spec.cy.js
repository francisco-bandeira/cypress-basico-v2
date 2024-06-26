/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', () => {
  const THEE_SEC_IN_MS = 3000

  beforeEach(() => {
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', () => {
    cy.title()
      .should('be.equal', 'Central de Atendimento ao Cliente TAT')
  });
  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = Cypress._.repeat('Lorem ipsum, ', 30)
    cy.clock()

    cy.get('#firstName').type('Francisco')
    cy.get('#lastName').type('Bandeira')
    cy.get('#email').type('francisco.frazzon@outlook.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
    cy.tick(THEE_SEC_IN_MS)
    cy.get('.success').should('not.be.visible')
  });
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()
    cy.get('#firstName').type('Francisco')
    cy.get('#lastName').type('Bandeira')
    cy.get('#email').type('francisco.outlook.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
    cy.tick(THEE_SEC_IN_MS)
    cy.get('.error').should('not.be.visible')
  });
  it('Campo telefone só aceita números', () => {
    cy.get('#phone').type('abcdefghij').should('have.value', '')
  });
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Francisco')
    cy.get('#lastName').type('Bandeira')
    cy.get('#email').type('francisco@outlook.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
    cy.tick(THEE_SEC_IN_MS)
    cy.get('.error').should('not.be.visible')

  });
  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Francisco').should('have.value', 'Francisco')
      .clear().should('have.value', '')

    cy.get('#lastName').type('Bandeira').should('have.value', 'Bandeira')
      .clear().should('have.value', '')

    cy.get('#email').type('francisco@outlook.com').should('have.value', 'francisco@outlook.com')
      .clear().should('have.value', '')

    cy.get('#phone').type('123456789').should('have.value', '123456789')
      .clear().should('have.value', '')

  });
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
    cy.tick(THEE_SEC_IN_MS)
    cy.get('.error').should('not.be.visible')

  });
  it('envia o formulário com sucesso usando um comando customizado', () => {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
    cy.tick(THEE_SEC_IN_MS)
    cy.get('.success').should('not.be.visible')
  });

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  });

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  });

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  });
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]').check()
      .should('have.value', 'feedback')
  });

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function ($radio) {
        cy.wrap($radio).check()
          .should('be.checked')
      })
  });
  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]').check()
      .last().uncheck()
      .should('not.be.checked');
  });

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário 2', () => {
    cy.clock()
    cy.get('input[type="checkbox"]').last().check()
      .should('be.checked');
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
    cy.tick(THEE_SEC_IN_MS)
    cy.get('.error').should('not.be.visible')
  });

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('cypress/fixtures/teste.jpg')
      .should(function (input) {
        expect(input[0].files[0].name).to.equal('teste.jpg')
      })
  });

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/teste.jpg', { action: 'drag-drop' })
      .should(function (input) {
        expect(input[0].files[0].name).to.equal('teste.jpg')
      })
  });

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture("teste.jpg").as("Exemplo");
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('@Exemplo')
      .should(function (input) {
        expect(input[0].files[0].name).to.equal('teste.jpg')
      })
  });

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  });

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()
    cy.contains('CAC TAT - Política de privacidade').should('be.visible');
  });

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
    cy.get('.success').should('not.be.visible')
      .invoke('show').should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide').should('not.be.visible')

    cy.get('.error').should('not.be.visible')
      .invoke('show').should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide').should('not.be.visible')
  });

  it('preenche a area de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('Lorem ipsum, ', 30)
    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
  });

  it('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should((response) => {
        const { status, statusText, body } = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  });

it('Encontra o gato escondido', () => {
  cy.get('#cat').should('not.be.visible')
      .invoke('show').should('be.visible')
});

})
