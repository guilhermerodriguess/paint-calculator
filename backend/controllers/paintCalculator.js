const calculatePaint = (req, res) => {
  const { walls } = req.body;

  try {
    if (!walls || walls.length !== 4) {
      throw new Error('Por favor, forneça medidas para 4 paredes.');
    }

    const paintRequired = calculatePaintRequired(walls);
    const cans = calculateCans(paintRequired);

    res.json({ paintRequired, cans });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const calculatePaintRequired = (walls) => {
  const WINDOW_AREA = 2.4;
  const DOOR_AREA = 1.52;
  const COVERAGE_PER_LITER = 5;

  let totalArea = 0;

  walls.forEach(wall => {
    const { height, width, windows, doors } = wall;
    let wallArea = height * width;

    if (wallArea < 1 || wallArea > 50) {
      throw new Error('A área da parede deve ter entre 1 e 50 metros quadrados.');
    }

    const windowArea = windows * WINDOW_AREA;
    const doorArea = doors * DOOR_AREA;
    const openingsArea = windowArea + doorArea;

    if (openingsArea > (wallArea / 2)) {
      throw new Error('A área total das portas e janelas não deve exceder 50% da área da parede.');
    }

    if (doors > 0 && height < 2.2) {
      throw new Error('A altura das paredes com portas deve ser pelo menos 30 cm maior que a altura da porta.');
    }

    wallArea -= openingsArea;
    totalArea += wallArea;
  });

  return totalArea / COVERAGE_PER_LITER;
};

const calculateCans = (paintRequired) => {
  const CAN_SIZES = [18, 3.6, 2.5, 0.5];
  const cans = [];

  CAN_SIZES.forEach(size => {
    while (paintRequired >= size) {
      cans.push(size);
      paintRequired -= size;
    }
  });

  if (paintRequired > 0) {
    cans.push(CAN_SIZES[CAN_SIZES.length - 1]);
  }

  return cans;
};

module.exports = { calculatePaint };
