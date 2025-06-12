function NavbarPlanta({ plantas, plantaSeleccionada, setPlantaSeleccionada }) {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      borderBottom: "2px solid #e2e2e2",
      padding: "10px 20px",
      marginBottom: "20px",
      background: "#fff"
    }}>
      {plantas.map(planta => (
        <div
          key={planta.id}
          onClick={() => setPlantaSeleccionada(planta.id)}
          style={{
            cursor: "pointer",
            fontWeight: plantaSeleccionada === planta.id ? "bold" : "normal",
            color: plantaSeleccionada === planta.id ? "#007bff" : "#333",
            borderBottom: plantaSeleccionada === planta.id ? "3px solid #007bff" : "3px solid transparent",
            paddingBottom: "5px"
          }}
        >
          {planta.nombre}
        </div>
      ))}
    </nav>
  );
}

export default NavbarPlanta;
