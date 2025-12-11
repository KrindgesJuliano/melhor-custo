import React, { useState, useEffect } from "react";

// Dados originais dos itens
const initialItemsData = [
  // ITENS COM BÔNUS: Bolacha Recheada, Wafer, Bala de Goma, Panettone/Chocotone
  {
    category: "Pequenas Alegrias",
    name: "Pacote de Bolacha Recheada",
    points: 10,
    id: "bolacha",
    bonusItem: true,
    price: "",
  },
  {
    category: "Pequenas Alegrias",
    name: "Pacote de Wafer",
    points: 10,
    id: "wafer",
    bonusItem: true,
    price: "",
  },
  {
    category: "Pequenas Alegrias",
    name: "Pacote de Bala de Goma/Fini (min 80g)",
    points: 10,
    id: "goma",
    bonusItem: true,
    price: "",
  },

  // ITENS SEM BÔNUS
  {
    category: "Sabor de Festa",
    name: "Caixa de Bis ou Hershey's Mais",
    points: 25,
    id: "bis",
    bonusItem: false,
    price: "",
  },
  {
    category: "Sabor de Festa",
    name: "Barra de Chocolate (min 80g)",
    points: 25,
    id: "barraChoco",
    bonusItem: false,
    price: "",
  },
  {
    category: "Sabor de Festa",
    name: "Pacote de Cookies",
    points: 25,
    id: "cookies",
    bonusItem: false,
    price: "",
  },
  {
    category: "O Grande Pedido",
    name: "Caixa de Bombom",
    points: 50,
    id: "cxBombom",
    bonusItem: false,
    price: "",
  },
  {
    category: "Símbolo do Natal",
    name: "Panettone ou Chocotone (400g/500g)",
    points: 80,
    id: "panettone",
    bonusItem: true,
    price: "",
  }, // BÔNUS
  {
    category: "Kit Sonho Mágico",
    name: "Kit Completo (1 Panettone + 1 Cx Bombom + 2 Pct Bolacha)",
    points: 200,
    id: "kit",
    bonusItem: false,
    price: "",
  },
];

function ItemRow({ item, handlePriceChange, ratio, isBestDeal, bonusActive }) {
  const currentPoints =
    item.bonusItem && bonusActive ? item.points * 2 : item.points;
  const isDoubled = item.bonusItem && bonusActive;

  return (
    <div className={`item-row ${isBestDeal ? "best-deal" : ""}`}>
      <label htmlFor={`price-${item.id}`}>{item.name}</label>
      <span className={`points ${isDoubled ? "doubled" : ""}`}>
        {currentPoints} pts {isDoubled && "(BÔNUS)"}
      </span>{" "}
      R$
      <input
        type="number"
        step="0.01"
        min="0"
        id={`price-${item.id}`}
        placeholder="0.00"
        value={item.price}
        onChange={(e) => handlePriceChange(item.id, e.target.value)}
      />
      <span>
        <span className="result">{ratio.toFixed(2)}</span> Pts/R$
      </span>
      <span className="best-label">{isBestDeal && "✅ MELHOR NEGÓCIO!"}</span>
    </div>
  );
}

function App() {
  const [items, setItems] = useState(initialItemsData);
  const [bonusActive, setBonusActive] = useState(false);
  const [bestDealId, setBestDealId] = useState(null);

  // Efeito para recalcular o melhor negócio sempre que os preços ou o bônus mudam
  useEffect(() => {
    let bestRatio = -1;
    let newBestDealId = null;

    const updatedItems = items.map((item) => {
      const price = parseFloat(item.price);
      const currentPoints =
        item.bonusItem && bonusActive ? item.points * 2 : item.points;
      let ratio = 0;

      if (price > 0 && !isNaN(price)) {
        ratio = currentPoints / price;
      }

      if (ratio > bestRatio) {
        bestRatio = ratio;
        newBestDealId = item.id;
      }
      // Anexa o ratio para ser usado na renderização
      return { ...item, ratio };
    });

    setItems(updatedItems);
    setBestDealId(newBestDealId);
  }, [items.map((i) => i.price).join(","), bonusActive]); // Dependências: preços e bônus

  const handlePriceChange = (id, newPrice) => {
    // Atualiza apenas o preço do item que mudou
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, price: newPrice } : item,
    );
    // O useEffect acima irá rodar e recalcular o ratio e o bestDealId
    setItems(updatedItems);
  };

  const toggleBonus = () => {
    setBonusActive((prev) => !prev);
  };

  // Agrupa os itens por categoria para exibição
  const groupedItems = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Texto para o botão de bônus atualizado
  const bonusButtonText = bonusActive
    ? "🟢 Bônus ATIVO (Itens de 10 pts: 20 pts | Panettone: 160 pts)"
    : "🔴 Ativar Bônus (Bolacha Recheada, Wafer, Bala de Goma e Panettone/Chocotone)";

  return (
    <div className="container">
      <h1>💰 Calculadora de Pontos por Custo (React)</h1>
      <p>
        Insira o preço de cada item e veja qual oferece o melhor custo-benefício
        (Pts/R$).
      </p>

      <div className="controls">
        <button
          id="bonusButton"
          onClick={toggleBonus}
          className={bonusActive ? "active" : ""}
        >
          {bonusButtonText}
        </button>
      </div>

      <div id="calculator">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <React.Fragment key={category}>
            <div className="category-header">{category}</div>
            {categoryItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                handlePriceChange={handlePriceChange}
                ratio={item.ratio || 0}
                isBestDeal={item.id === bestDealId}
                bonusActive={bonusActive}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <style jsx="true">{`
        /* Estilos (mantidos do código anterior) */
        .container {
          font-family: Arial, sans-serif;
          margin: 0 auto;
          max-width: 1200px;
          padding: 20px;
          background-color: white;
          color: black;
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #ccc;
          padding-bottom: 10px;
        }
        .controls {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #e3f2fd;
          border-radius: 5px;
          display: flex;
          align-items: center;
        }
        .controls button {
          padding: 10px 15px;
          font-size: 1em;
          cursor: pointer;
          border: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        #bonusButton {
          background-color: #ffc107;
          color: #333;
        }
        #bonusButton.active {
          background-color: #28a745;
          color: white;
        }
        .item-row {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .item-row.best-deal {
          border: 3px solid #28a745;
          background-color: #e6ffed;
          font-weight: bold;
        }
        .item-row label {
          flex: 2;
          margin-right: 15px;
        }
        .item-row input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          text-align: right;
          margin-right: 15px;
          max-width: 100px;
          background-color: white;
          color: black;
        }
        .item-row span {
          flex: 1;
          text-align: right;
          font-size: 1.1em;
          color: #007bff;
        }
        .points {
          width: 100px;
          text-align: center;
          font-weight: bold;
          color: #6c757d;
        }
        .points.doubled {
          color: #dc3545;
          font-weight: bolder;
        }
        .best-label {
          color: #28a745;
          font-size: 1.2em;
          margin-left: 10px;
        }
        .category-header {
          background-color: #e9ecef;
          padding: 5px 10px;
          margin-top: 20px;
          border-radius: 5px 5px 0 0;
          font-weight: bold;
          color: #495057;
        }
      `}</style>
    </div>
  );
}

export default App;
