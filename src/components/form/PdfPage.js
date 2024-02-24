import { Card, Container, Grid } from "@mui/material";
import HTMLComment from "../../hooks/HTMLComment";
import QRCode from "react-qr-code";
import logo from "./../../assets/logo-goya.png";

export const PdfPage = ({
selected,
selectedObj,
}) => {
    return (
        <Container key="reportTable" id="reportTable" sx={{ background: "white" }}>
          {console.log(selected, selectedObj)}
          {selectedObj.map((row, index) => {
            return (
              <>
                <Card key={row.id} id={row.id}>
                  <Grid container spacing={0} sx={{padding: "25px 10px"}}>
                    <Grid item xs={4}>
                      <img
                        src={logo}
                        alt="Goya Express Delivery"
                        loading="lazy"
                        width={150}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <p style={{ fontWeight: "bolder", fontSize: "12px" }}>
                        Télefono: 0967216989
                        <br />
                        Guayaquil - Quito - Machala - Cuenca
                        <br />
                        Sitio web:{" "}
                        <a href="http://goyaexpressdelivery.com">
                          goyaexpressdelivery.com
                        </a>
                      </p>
                    </Grid>
                    <Grid item xs={4}>
                      <QRCode
                        title={`row.id`}
                        value={
                          "http://sigo.goyaexpressdelivery.com/recibo/" + row.id
                        }
                        size={60}
                      />
                      {/* {() => {
                        const svg = () => {
                          return (
                            <QRCode
                              level="Q"
                              style={{ width: 256, marginBottom: 50 }}
                              value={"hello world"}
                            />
                          );
                        };
                        const serializer = new XMLSerializer();
                        const svgStr = serializer.serializeToString(svg);
                        const img_src =
                          "data:image/svg+xml;base64," + window.btoa(svgStr);
                        console.log(img_src);
                        return <img src={img_src} />;
                      }} */}
                    </Grid>
                  </Grid>

                  {Array.from({ length: 3 }, (_, i) => (
                    <Grid
                      key={i}
                      container
                      spacing={0}
                      sx={{
                        textAlign: "left",
                        margin: "25px 20px",
                        border: "solid 1px #a3a3a3",
                        borderRadius: "5px",
                        width: "calc(100% - 42px)",
                        backgroundColor: "#b8cce4",
                      }}
                    >
                      <Grid item xs={12} className="pdfItem">
                        {row.guia}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Fecha
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.fechaEntrega}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Servicio
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.Servicio.nombre}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Origen
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.origen}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Destino
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.destino}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Dirección
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.direccionOrigen}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Dirección
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.direccionDestino}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Envia
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.destinatario}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Recibe
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.remitente}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Telefono
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.telefonoDestinatario}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Telefono
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.telefonoRemitente}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Ciudad
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.ciudadOrigen.nombre}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Ciudad
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.ciudadDestino.nombre}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Producto
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.producto}
                      </Grid>
                      <Grid item xs={2} className="pdfItem">
                        Costo
                      </Grid>
                      <Grid item xs={4} className="pdfValue">
                        {row.precio}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        className="pdfItem"
                        sx={{ borderRadius: "0 0 0 5px" }}
                      >
                        Descripción
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        className="pdfValue"
                        sx={{ borderRadius: "0 0 5px 0" }}
                      >
                        {row.descripcion}
                      </Grid>
                    </Grid>
                  ))}
                </Card>
                <HTMLComment comment="ADD_PAGE" />
              </>
            );
          })}
        </Container>
    )
}