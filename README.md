# 🏥 Plantão de Farmácias — Piranga, MG

Single Page Application (SPA) para consulta do plantão de farmácias de **Piranga - Minas Gerais**. Desenvolvida com foco em **Mobile-First** e usabilidade rápida para situações de urgência.

---

## ✅ Funcionalidades Implementadas

- **Plantão de Hoje**: Ao abrir o site, exibe automaticamente a farmácia de plantão no dia atual (fuso de Brasília)
- **Consulta por Data**: Seletor de data interativo com atualização instantânea sem reload
- **Card Completo da Farmácia**: Nome, ícone, botões de Ligar, WhatsApp e Google Maps
- **Links Extras Dinâmicos**: Site, Instagram e Email (ocultos automaticamente se vazios)
- **Sem Plantão**: Mensagem amigável com lista de todos os telefones ao clicar
- **Próximos Plantões**: Lista clicável dos próximos 6 plantões a partir da data selecionada
- **Farmácias em Piranga**: Grade com todas as farmácias, links de contato e localização
- **Botão SAMU 192**: Acesso direto à emergência no header
- **Animações SPA**: Transição suave de fade+slide ao trocar datas
- **Responsivo**: Layout adaptado para celular, tablet e desktop

---

## 📁 Estrutura do Projeto

```
index.html          → Estrutura HTML semântica da SPA
css/
  style.css         → Estilos CSS (Mobile-First, variáveis, grid, animações)
js/
  data.js           → Base de dados: farmácias + escala de plantões
  app.js            → Lógica da SPA: renderização, estado, eventos
README.md           → Documentação
```

---

## 🗺️ Caminhos e Entradas

| URI         | Descrição                          |
|-------------|-------------------------------------|
| `/`         | Página principal — plantão de hoje  |

---

## 🏪 Farmácias Cadastradas

| Farmácia     | Telefone         |
|--------------|------------------|
| Guarapiranga | (31) 3746-1228   |
| UAI Farma    | (31) 3746-2211   |
| Dora         | (31) 3746-1112   |
| São Pedro    | (31) 3746-1620   |
| Multifarma   | (31) 97193-0664  |
| Drogary      | (31) 3746-1360   |

---

## 📅 Escala de Plantões

A escala cobre datas de **01/01/2026 a 31/01/2027** com plantões em domingos e feriados. Os dados ficam em `js/data.js` no objeto `PHARMACY_DATA.shift_schedule`.

---

## 🔧 Como Atualizar os Dados

Para adicionar novos plantões, edite o objeto `shift_schedule` em `js/data.js`:

```js
"2027-02-07": "Nome da Farmácia"
```

---

## 🚀 Próximos Passos Sugeridos

- [ ] Adicionar notificações push para lembrar o plantão do dia
- [ ] Implementar botão de compartilhamento nativo (Web Share API)
- [ ] Adicionar visualização de calendário mensal com todos os plantões
- [ ] PWA: service worker + manifest para instalação no celular
- [ ] Integração com API para atualização automática da escala
