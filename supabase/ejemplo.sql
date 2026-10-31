-- Prendas de ejemplo para probar la web. Ejecútalo después de schema.sql.
-- Cuando tengas las prendas reales, bórralas desde Table Editor y carga las tuyas.
insert into public.productos (nombre, categoria, talla, estado, precio) values
  ('Chaqueta denim', 'Chaquetas', 'M', 'Buen estado', 25.00),
  ('Camisa de franela', 'Camisas', 'M', 'Buen estado', 12.00),
  ('Jeans rectos', 'Pantalones', '32', 'Buen estado', 18.00),
  ('Sudadera con capucha', 'Chaquetas', 'L', 'Buen estado', 15.00),
  ('Camiseta gráfica', 'Camisas', 'M', 'Buen estado', 10.00),
  ('Pantalón cargo', 'Pantalones', '30', 'Buen estado', 20.00),
  ('Gorra', 'Accesorios', 'Única', 'Buen estado', 8.00),
  ('Cinturón de cuero', 'Accesorios', 'Única', 'Buen estado', 9.00);
