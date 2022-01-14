const db = require("../app/model/index.js");
const sequelize = require("./sequelize.js");
const Customtype = db.Customtype;
const CustomtypeValue = db.CustomtypeValue;

let seeddb = async () => {
  const CUSTOM_TYPES = [
    {
      customTypeName: "view",
      customtypevalues: [
        { value: "north" },
        { value: "south" },
        { value: "east" },
        { value: "west" },
      ],
    },
    {
      customTypeName: "propertytype",
      customtypevalues: [
        { value: "one room apartment" },
        { value: "two room apartment" },
        { value: "two bedroom apartment" },
        { value: "four bedroom apartment" },
        { value: "multi bedroom apartment" },
        { value: "maisonette" },
        { value: "house" },
        { value: "floor" },
        { value: "studio" },
        { value: "basement" },
        { value: "building" },
        { value: "villa" },
        { value: "hall" },
        { value: "shop" },
        { value: "shopping center" },
        { value: "cafe" },
        { value: "industrial property" },
        { value: "gas station" },
        { value: "hotel" },
        { value: "composition" },
        { value: "factory" },
        { value: "agricultural property" },
        { value: "forest" },
        { value: "dam" },
        { value: "prefabricated house" },
        { value: "project" },
      ],
    },
    {
      customTypeName: "otherpremise",
      customtypevalues: [
        { value: "closet" },
        { value: "wardrobe" },
        { value: "basement" },
        { value: "ceiling" },
        { value: "working office" },
      ],
    },
    //{customTypeName:"neighborhood",customtype_values:[]},
    //{customTypeName:"location",customtype_values:[{}]},
    {
      customTypeName: "heating",
      customtypevalues: [
        { value: "central heating" },
        { value: "electricity" },
        { value: "wood" },
        { value: "gas" },
        { value: "floor heating" },
      ],
    },
    {
      customTypeName: "furnishing",
      customtypevalues: [
        { value: "fully furnished" },
        { value: "unfurnished" },
        { value: "partly furnished" },
      ],
    },
    {
      customTypeName: "floor",
      customtypevalues: [
        { value: "laminate" },
        { value: "wooden parquet" },
        { value: "wooden floor" },
        { value: "terracotta" },
      ],
    },
    {
      customTypeName: "document",
      customtypevalues: [
        { value: "Proof of Ownership" },
        { value: "Tax Assessment" },
        { value: "Sketch of Property" },
      ],
    },
    {
      customTypeName: "constructiontype",
      customtypevalues: [
        { value: "Large Area Formwork" },
        { value: "Brick" },
        { value: "Panel" },
        { value: "Trimmerjoists" },
        { value: "prefabricated construction" },
      ],
    },
    {
      customTypeName: "closeto",
      customtypevalues: [
        { value: "school" },
        { value: "kinder garden" },
        { value: "food store" },
        { value: "subway" },
        { value: "hospital" },
        { value: "bank" },
        { value: "gas station" },
        { value: "fitness" },
        { value: "park" },
        { value: "resturant" },
      ],
    },
    {
      customTypeName: "constructionstage",
      customtypevalues: [
        { value: "Project" },
        { value: "In construction" },
        { value: "AKT 14" },
        { value: "AKT 15" },
        { value: "AKT 16" },
      ],
    },
  ];

  //Get Trasaction
  let transaction = await db.sequelize.transaction();

  try {
    for (let customtype of CUSTOM_TYPES) {
      await Customtype.create(customtype, {
        include: [{ association: Customtype.associations.customtypevalues }],
        transaction,
      });
    }

    await transaction.commit();

    console.log("\x1b[32m", "Custom Type Names Seeded");
  } catch (err) {
    console.error("Error seeding database \n");
    await transaction.rollback();
    console.error(err);
    process.exit();
  }
};

module.exports = seeddb;
