import logo from "../assets/logo.png";

function Navbar({ plantas, plantaSeleccionada, setPlantaSeleccionada }) {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 20px",
      borderBottom: "2px solid #eee",
      background: "#fff"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img src={logo} alt="Logo" style={{ height: "25px" }} />

        {plantas.map(planta => (
          <span
            key={planta.id}
            onClick={() => setPlantaSeleccionada(planta.id)}
            style={{
              cursor: "pointer",
              fontWeight: plantaSeleccionada === planta.id ? "bold" : "normal",
              color: plantaSeleccionada === planta.id ? "#007bff" : "#333",
              borderBottom: plantaSeleccionada === planta.id ? "3px solid #007bff" : "3px solid transparent",
              paddingBottom: "4px"
            }}
          >
            {planta.nombre}
          </span>
        ))}
      </div>
    </header>
  );
}

export default Navbar;
