import React, { useState, useEffect } from "react";
import { Card, Container, Grid } from "@mui/material";
import HTMLComment from "../../hooks/HTMLComment";
import QRCode from "qrcode";
import logo from "./../../assets/logo-goya.png";

export const PdfPage = ({ selectedObj, body }) => {
  const qr = (guia, url) => {
    let qr = [];
    const imgData = QRCode.toDataURL(url, { type: "png" }).then((img) => {
      qr[guia] = img;
      setQR({ ...qrs, ...qr });
    });
  };

  const [qrs, setQR] = useState([]);

  useEffect(() => {
    console.log("PdfPage", selectedObj);
    selectedObj.map((row, index) => {
      qr(row.guia, "http://sigo.goyaexpressdelivery.com/recibo/" + row.guia);
    });
  }, [selectedObj]);

  return (
    <Container key="reportTable" id="reportTable" sx={{ background: "white" }}>
      {selectedObj.map((row, index) => {
        return (
          <>
            <Card
              className="qrPage"
              key={row.id}
              id={row.id}
              sx={{ width: "595px", height: "841px", background: "white" }}
            >
              <Grid
                className="qrPageC"
                container
                sx={{
                  width: "595px",
                  height: "841px",
                  background: "white",
                  fontSize: "10px",
                }}
              >
                <Grid
                  container
                  xs={12}
                  spacing={0}
                  sx={{ padding: "20px 10px 5px 10px", height: "70px" }}
                >
                  <Grid item xs={4} sx={{ textAlign: "left" }}>
                    <img
                      src={logo}
                      alt="Goya Express Delivery"
                      loading="lazy"
                      width={150}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <p style={{ fontWeight: "bolder" }}>
                      Télefono: 0967216989
                      <br />
                      Sitio web:{" "}
                      <a href="http://goyaexpressdelivery.com">
                        goyaexpressdelivery.com
                      </a>
                    </p>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "right" }}>
                    <img src={qrs[row.guia]} alt={qrs[row.guia]} width={90} />
                  </Grid>
                </Grid>

                {Array.from({ length: body }, (_, i) => (
                  <Grid
                    key={i}
                    container
                    spacing={0}
                    sx={{
                      textAlign: "left",
                      margin: "5px 10px",
                      borderRadius: "5px 5px 0px 0px",
                      width: "calc(100% - 20px)",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      className="pdfItem"
                      sx={{ borderRadius: "5px 5px 0px 0px" }}
                    >
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
                      {row.Servicio?.nombre}
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
                      {row.ciudadOrigen?.nombre}
                    </Grid>
                    <Grid item xs={2} className="pdfItem">
                      Ciudad
                    </Grid>
                    <Grid item xs={4} className="pdfValue">
                      {row.ciudadDestino?.nombre}
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
                    <Grid item xs={2} className="pdfItem">
                      Descripción
                    </Grid>
                    <Grid item xs={10} className="pdfValue">
                      {row.descripcion}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </>
        );
      })}
    </Container>
  );
};
