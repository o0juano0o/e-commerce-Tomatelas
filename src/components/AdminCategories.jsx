import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { removeProduct } from "../store/products";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { getSelectedProduct } from "../store/selectedProduct";
import { getAllProducts } from "../store/products";
import {
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Avatar,
  IconButton,
} from "@material-ui/core";
// icons

import DeleteIcon from "@material-ui/icons/Delete";
import { RemoveCircleOutline } from "@material-ui/icons";
const axios = require("axios");
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  cartFooter: {
    padding: theme.spacing(4),
  },
  stock: {
    color: "#afafaf",
  },
}));

const AdminProducts = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios.get("/api/category").then((res) => {
      return setCategory(res.data);
    });
  }, []);
  const classes = useStyles();

  const handleClick = (id) => {
    dispatch(getSelectedProduct(id));
  };

  const handleDelete = (productId) => {
    console.log(productId);
    dispatch(removeProduct(productId));
  };

  return (
    <>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell align="right">
              <Link to={`/create/products/`}>
                <Button variant="contained" color="primary" size="large">
                  Agregar Producto
                </Button>
              </Link>
            </TableCell>
          </TableRow>
          {products?.map((product) => (
            <>
              <TableRow key={product.id}>
                <TableCell>
                  <Link
                    onClick={() => handleClick(product.id)}
                    to={`/edit/products/${product.id}`}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={product.img}
                      className={classes.large}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  {<Typography component="text">{product.name}</Typography>}
                </TableCell>
                <TableCell align="right">{`${product.volume}`}</TableCell>
                <TableCell align="right">{`${product.brand}`}</TableCell>
                <TableCell align="right">{`${product.stock}`}</TableCell>
                <TableCell align="right">{`$${product.price}`}</TableCell>
                <TableCell align="right">
                  <IconButton edge="end" color="inherit">
                    <DeleteIcon onClick={() => handleDelete(product.id)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AdminProducts;
