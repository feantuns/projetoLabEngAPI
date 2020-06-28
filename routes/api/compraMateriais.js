const express = require('express');
const router = express.Router();
const CompraMaterial = require('../../models/CompraMaterial');
const Material = require('../../models/Material');
const Administrador = require('../../models/Administrador');
const { ensureAuthenticated } = require('../../config/auth');

const findMaterialsAndAdmin = compras => {
  return compras.map(async compra => {
    const material = Material.findOne({
      where: { id: compra.material_id },
    });
    const admin = Administrador.findOne({
      where: { id: compra.admin_id },
    });

    return Promise.all([material, admin]).then(responses => {
      return {
        ...compra.dataValues,
        material: responses[0].dataValues.nome,
        admin: responses[1].dataValues.nome,
      };
    });
  });
};

router.get('/', ensureAuthenticated, async (req, res) => {
  let compras = await CompraMaterial.findAll();

  if (!compras) {
    return res.status(500).json([{ message: 'Erro ao buscar compras' }]);
  }

  compras = findMaterialsAndAdmin(compras);

  Promise.all(compras).then(responses => res.json(responses));
});

// Get list of compras by admin id
router.get('/admin/:adminId', ensureAuthenticated, async (req, res) => {
  const { adminId } = req.params;

  let compras = await CompraMaterial.findAll({
    where: { admin_id: adminId },
  });

  if (!compras) {
    return res.status(500).json([{ message: 'Erro ao buscar compras' }]);
  }

  compras = findMaterialsAndAdmin(compras);

  Promise.all(compras).then(responses => res.json(responses));
});

// Get list of compras by material id
router.get('/material/:materialId', ensureAuthenticated, async (req, res) => {
  const { materialId } = req.params;

  let compras = await CompraMaterial.findAll({
    where: { material_id: materialId },
  });

  if (!compras) {
    return res.status(500).json([{ message: 'Erro ao buscar compras' }]);
  }

  compras = findMaterialsAndAdmin(compras);

  Promise.all(compras).then(responses => res.json(responses));
});

// Add member to a group
router.post('/', ensureAuthenticated, async (req, res) => {
  const {
    admin_id,
    material_id,
    fornecedor,
    valor,
    quantidade,
    data,
  } = req.body;

  if (
    !admin_id ||
    !material_id ||
    !fornecedor ||
    !valor ||
    !quantidade ||
    !data
  ) {
    res.status(500).json([
      {
        message:
          'Informe todos os dados: admin_id, material_id, fornecedor, valor, quantidade, data',
      },
    ]);
  }

  const adminDaCompra = await Administrador.findOne({
    where: { id: admin_id },
  });

  if (!adminDaCompra) {
    return res.status(400).json([{ message: 'Administrador não existe.' }]);
  }

  const materialDaCompra = await Material.findOne({
    where: { id: material_id },
  });

  if (!materialDaCompra) {
    return res.status(400).json([{ message: 'Material não existe.' }]);
  }

  const postCompra = await CompraMaterial.create({
    admin_id,
    material_id,
    fornecedor,
    valor,
    quantidade,
    data,
  });

  if (!postCompra) {
    return res.sendStatus(500).json([{ message: 'Erro ao cadastrar compra' }]);
  }

  // acrescentar quantidade material
  const updates = {
    quantidade: Number(materialDaCompra.quantidade) + Number(quantidade),
  };

  await Material.update({ ...updates }, { where: { id: material_id } });

  return res.status(200).json(postCompra);
});

// Editar compra
router.put('/:compraId', ensureAuthenticated, async (req, res) => {
  const { compraId } = req.params;
  const {
    admin_id,
    material_id,
    fornecedor,
    valor,
    quantidade,
    data,
  } = req.body;
  let errors = [];
  let materialDaCompra;

  if (!compraId) {
    errors.push({ message: 'Informe o id de um grupo.' });
  }

  if (admin_id) {
    const adminDaCompra = await Administrador.findOne({
      where: { id: admin_id },
    });

    if (!adminDaCompra) {
      return res.status(400).json([{ message: 'Administrador não existe.' }]);
    }
  }

  if (material_id) {
    materialDaCompra = await Material.findOne({
      where: { id: material_id },
    });

    if (!materialDaCompra) {
      return res.status(400).json([{ message: 'Material não existe.' }]);
    }
  }

  const compraInformada = await CompraMaterial.findOne({
    where: { id: compraId },
  });

  if (!compraInformada) {
    errors.push({ message: 'A compra não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const updates = {
    admin_id: admin_id || compraInformada.admin_id,
    material_id: material_id || compraInformada.material_id,
    fornecedor: fornecedor || compraInformada.fornecedor,
    valor: valor || compraInformada.valor,
    quantidade: quantidade || compraInformada.quantidade,
    data: data || compraInformada.data,
  };

  await CompraMaterial.update({ ...updates }, { where: { id: compraId } });

  // altera quantidade material caso tenha mudado
  if (quantidade) {
    if (!material_id) {
      materialDaCompra = await Material.findOne({
        where: { id: compraInformada.material_id },
      });

      if (!materialDaCompra) {
        return res.status(400).json([{ message: 'Erro ao buscar material.' }]);
      }
    }

    const newQuantidade =
      Number(materialDaCompra.quantidade) -
      Number(compraInformada.quantidade) +
      Number(quantidade);

    await Material.update(
      { quantidade: newQuantidade },
      { where: { id: materialDaCompra.id } }
    );
  }
  res.sendStatus(204);
});

// Remove member of a group
router.delete('/:compraId', ensureAuthenticated, async (req, res) => {
  const { compraId } = req.params;
  let errors = [];

  if (!compraId) {
    errors.push({ message: 'Informe o id de uma compra.' });
  }

  const compraInformada = await CompraMaterial.findOne({
    where: { id: compraId },
  });

  if (!compraInformada) {
    errors.push({ message: 'A compra não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const deleteCompra = await CompraMaterial.destroy({
    where: {
      id: compraId,
    },
  });

  if (!deleteCompra) {
    errors.push({ message: 'Erro ao excluir compra.' });
    return res.status(500).json(errors);
  }

  // Subtrai quantidade do material
  const materialDaCompra = await Material.findOne({
    where: { id: compraInformada.material_id },
  });

  if (!materialDaCompra) {
    return res
      .status(400)
      .json([{ message: 'Erro ao buscar material para subtrair quantidade.' }]);
  }

  const newQuantidade =
    Number(materialDaCompra.quantidade) - Number(compraInformada.quantidade);

  await Material.update(
    { quantidade: newQuantidade },
    { where: { id: materialDaCompra.id } }
  );

  return res.sendStatus(204);
});

module.exports = router;
