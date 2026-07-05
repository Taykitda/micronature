var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config2 = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var import_multer = __toESM(require("multer"), 1);

// db.ts
var import_config = require("dotenv/config");
var import_promise = __toESM(require("mysql2/promise"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/data.ts
var BRAND_IMAGES = {
  heroBg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXk4dld6Xfu0w9h8c7YNYdorf7ont8zPc2CvjIYgUwPgRT-5gJ3rlqYbdp8AIEZwqEYh1i3NVdzc9Xd3x6iv1kzccKtqeyNcNWjOYtpqmMv4QEYiri6f0dNtiFiTZHHWXeQoTUc1tD6yUKn2agptMliZUVpQwcE5KVCeYcF9AF-jAT3w3ffEcMxcftunpZPwwB3unnwDfQJgpM-fxD6imXhh6hzqa-7ujki2w9be9Kq8u2hbHifiKO4gBfSZtFpkVJkmv-cjxV_Q",
  landscapeTopDown: "https://lh3.googleusercontent.com/aida-public/AB6AXuD31GnEXDCKf654wY-svaTfBlhE3xlSpOFQNV8HqEdAUlamVVRm1WNWKF5q1NLfMmTyKgYLXXr_KPMbb_wAzjg0391QoUzFdSA3YgOE-U7Q3DZx30vdfA8m1Lwn4GQVg9av4wiDvyaGuFwzk8gWwN0NQi9UkB3e9QTqN8PdvvsqONkMq3340o7vRTTOtbYZB2_WGsBU8G0B63VH3CT5lITR_Y-yizVKkXCXiAbAocs5ppg1knGcTEP4p8t_HzU3v1TlQKHOj0LleA",
  fiddleFigCloseup: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFnJ5f1csg3Irxliqfxmi4XJq0RGgZKY9Ac11e9vnnvZyoxS_ON02Agy0vel7h25YsY-wXxcXEHuJd_EcwHsTN9L37pf6lG6WKQg78xciUht6KBvp4LHn88yZWa4ErA_hKA-pv1D0Ehs2KAiQ7_oXQc_6_BrNBjPZ7-nIH38wK46-jl0xq5YPjtZxP3ne8MOgq7AQoY8c7TfW109NUVqPUN7rO8PG8VHB_sCnT7PpHY-9l8NOvzYgaGRPmWuDeChU7xqKqj4eu1Q",
  monsteraCloseup: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpCDKbRu7y_lb_rCmHRcCqPCVZ42h_Myd4DgZofxyUcn4C35oPzn94R1mw_cwABcIes87MqwxwsI588dKo045D3rhMaammxn5C05VBaZVfSnRdoN6z1B5ggZ__QtQmL_gqlkkH0TL_yCmHJOHFLvDm0n8NNNGJ39f1-CXi9W_HMq7HzFT0lgA4qJMSlzBZU29spGuO8CgIP74UwtlaPL_z6pO3ebwMfdun_84RZ4NBGJ3ohRdd7RIyZaaS83crcthPswwUEJwq6g",
  fiddleFigWide: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoqSFcCZAV98t274qfMrv9l_sIR-sUYXWhoPGBd1PFMaPodrnmwTII1LwvdUK0TvkIOG3Y7Bl0tilp3HR9VuAK5Ob7IMpHRu_HCaVGvu1guxy6UFW1qSsvmcQ6HWsUQgZamcLdBODQXHgG83jxpzxlrEFUPUY4B_94bFAUunrX-zE8uFbghUugmCHnYUmL6Ek9kNiCLtk5zTDWRQplbZChF65KRuDL9Bfwg0ZaI3UuiifFjm6GgLAK_B0kOkuMXg8YyEdWcwRFLA",
  monsteraWide: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGTNxtk6tftw9oo_a_yZ1ae--cx0VcAOKWGpBtfjdSzOA4z4myrQBCbfXksbAQxkjPKI9o1xPk929KXZVR4mmNbryqlb7D5AtB5oFWUZwBNwQxK_8EWe4_2IYIXeIc9q0DOB6Aa0mSuNUgTbfIuwWc-qJzSHkmwtiKk5ArEOoEW44gB2n_ZLLPBWu4i_q_FbvJy6kvbpM0Co5pCBqZ7G1LsWBYKzHMhQAe8T-wXqYzYRLXV3tPtG2TWuirs8kfutCc7Us1g4EWXg",
  nasaBanner: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEQicfROy6_lwfxPPZelGqobN--5FiIrAxPy4XYWRkG3pmlzyyHqin1O8dyL3CAhJYjLF7Ll5PK_AFcqItuCTOk00TzcZMAuQFWL1g-lRiI2VeyhDNkpxgnNPe7hgWOVfTvb76Uv2JlxpBudU1b6uyiwHgD3KhiVg1kq0mEcgFSXUZWqGVIF7ZIuCT97ijYUb997JArld8Ir1PtCcyZ2NQ1KPajbnq2CC8G5TdTbP5hadq_1EIzWe6_VvG6VxZFuu-WeV9QrQGzg",
  rainforestHero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBt5OuGaKdXQ96aF6PV5AHuIZFxxdlXykYscInreLLzAKnrRxMxhxKDuMmoG4qfMxg6DIjVQPqnfCXGwO7gQyBzDmrneCosqdWImMNkw70_Tzf7FOVpCALAHAQEWlV4kR6qFVB8sn77OOwYPLLDtf-XFiBjgB5EDeZJ6aBylO6qarU8ndkby_5Y61MRtDofGKcWoA19y_nMBTxphEXriijACb3jlwAn_TjHKz2wE5UniWM__GQHq9s__ziX4xbVJpOaFn-evS-vJw",
  bonsaiHero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJP3IyFI4KSaGgI0KRSWld6XRKa6ChGeCAXb649ionq4xV8KkaU4y7C6eKYrznGClbdTFDvFrdFTM7BhHBd5wCvU4x3cL28glcs_PP7tQIN6gpv9P5t4o1csPfcl20atLtrX2h75FoRpAb9YvNdZxgVIe8b0ve5zwZiXzSWvHWjWyOx0CLUQ3D0JIUQzksie52opqg0ZqrWzqVaiVuXhDgBf36Ga_w3tiRb7bnLxa9NTQKOR7DLqYSEFwazYjt4PimnXfQ-Zwh1g",
  succulentHero: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSAfu_wa60m0CoxhMOh6vQZGCsWScRP7tATvtHMlTzu-4Ky7JKdBMLu0bYDpe0gxzkaxliccb83XUEE837hwzpnLzaK_oq2BqnME_L4X3UAUBQfwA6GPCcjZWKe8r5ImuPJHEQDSKcRmjZiPgYLiI-m5vYo0AmfqHK8Wj1vYqEg54JxF5YdJ25sE228wYKNnpjl1yHMi9HLgFiMzmK5lGgYNGR46S3xNvkqh4LW_npxXBu2iX8VMbOxsx2Kn2c479GqX1lVHg67Q",
  masterclassThumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTbw4Nte_QUk4DxvblGODzr-cbL-6hClyFgDOqQ8sRZdzLVyjmLStDUvh4vEqDjhAPv9AwjIsj9VoSC1is8b2OES-vQVUf1Ojb9Pn1xWPhZsVImxKbTG5GSLw3CJWVjbfhGZr5lTDh68R2da2S_padxr-imhjboDNXYrqts3mSzcI8ZuQew_HntzPoK-86o1y5ziw-vyusBe54bAhsHpB_FQUQOEBhxJs7ZfEuL-NjKfLqRLp3zW6vdQPNEMy3C0Yj4c_bHQE2VQ",
  expertAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm7Jqsmi4-Pjxc_bnVemoEJXUfo1VGtYFKLkngzebR4kqoNegz4TuzHsX7_aruJtuDLt6HJ3a2dHC8Y_YJ4OF2NpKmQp8QyxomnlftsdsA9Lih3kVY-6CzCPHWLjT7zzY76DZf9MUd0h7tC3MyZxbe_OG38ccKHYZlyy_w1s-FORkU3Njccck8nVzhaLSGbNA0lU9A473bRvLmu_dfgYjRAvUkKXsTIdZlvF06WqNsZa0QN_q84Ne9LSvVy4BlTAYukNltsgOkWQ",
  splitCardFern: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA1xk4joGCgBpBnmLq_2CJk5HXAdss4GFF3S7HUjNRtQ5PfIbE8216bcshOxjN7ufgX8aarLPHSdW6z1VV6estC6lEgmdAlHw5UcUUbD5en5rNes8vRc4g6TTpDUNu2Xkyb1Qpi-EWxpUd3nXFfyLTdxEstlMS6hj4nl679k1caenGmaBJVgb6VWYf8Mp4AvsP_RRPOWhL0LOqcH4pF5nliBvumxF3IkGRb68i2ZPc233bFQlmucU7whDFOywv0cm4aavdT4ZOKA"
};
var INITIAL_PLANTS = [
  {
    id: "plant-1",
    name: "\u5927\u5385\u7434\u53F6\u6995",
    latinName: "Ficus lyrata",
    status: "warning",
    thumbnail: BRAND_IMAGES.fiddleFigWide,
    soilMoisture: 20,
    soilStatus: "20% (\u8FC7\u4F4E)",
    lightLevel: 70,
    lightStatus: "\u9002\u5B9C",
    category: "\u5929\u5357\u661F\u79D1"
  },
  {
    id: "plant-2",
    name: "\u5367\u5BA4\u9F9F\u80CC\u7AF9",
    latinName: "Monstera deliciosa",
    status: "optimal",
    thumbnail: BRAND_IMAGES.monsteraWide,
    soilMoisture: 60,
    soilStatus: "60% (\u9002\u5B9C)",
    lightLevel: 80,
    lightStatus: "\u9002\u5B9C",
    category: "\u5929\u5357\u661F\u79D1"
  }
];
var INITIAL_TASKS = [
  {
    id: "task-1",
    plantId: "plant-1",
    taskName: "\u7ED9\u7434\u53F6\u6995\u6D47\u6C34",
    plantName: "\u5927\u5385\u7434\u53F6\u6995",
    category: "watering",
    done: false,
    description: "\u5DF2\u903E\u671F 1 \u5929 \u2022 \u9700\u6C34\u91CF\uFF1A\u4E2D\u7B49",
    thumbnail: BRAND_IMAGES.fiddleFigCloseup
  },
  {
    id: "task-2",
    plantId: "plant-2",
    taskName: "\u4E3A\u9F9F\u80CC\u7AF9\u65BD\u80A5",
    plantName: "\u5367\u5BA4\u9F9F\u80CC\u7AF9",
    category: "fertilizer",
    done: false,
    description: "\u5EFA\u8BAE\u65BD\u7528\u6DB2\u4F53\u6C2E\u80A5",
    thumbnail: BRAND_IMAGES.monsteraCloseup
  }
];
var ENCYCLOPEDIA_PLANTS = [
  {
    id: "ep-1",
    name: "\u9F9F\u80CC\u7AF9",
    latinName: "Monstera deliciosa",
    category: "\u5929\u5357\u661F\u79D1",
    lightRequirement: "diffuse",
    toxicity: "toxic",
    difficulty: "easy",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKpeyTKP0ctRicudRw03kYCBy_nK0nmAZabt8_PBQhT60VwEWVvAnOOx-VsYPYmzWWWJcBGIXZ_oXATcKdWJakhsQLZbYhcb9FpSytyRt7iNBjKxEsztyE-1BDzQpWUShB8VFoADPRs80RbnXNvJac6TdedAGt-RgxbU_Me56XYayQjcddK2mp06JCJPPcrhmTHYEhnZY6C2syVtQzze4ekier2mGNb7sS2gm-PBNY0aH5pRHircVrCQzX1Q2ibDLIyuNL3evZVQ",
    waterRequirement: "\u4FDD\u6301\u571F\u58E4\u5FAE\u6E7F",
    description: "\u5929\u5357\u661F\u79D1\u9F9F\u80CC\u7AF9\u5C5E\u5E38\u7EFF\u6728\u8D28\u85E4\u672C\u3002\u53F6\u5927\u5F62\uFF0C\u7FBD\u72B6\u6DF1\u88C2\uFF0C\u8D28\u539A\uFF0C\u751F\u673A\u52C3\u52C3\u3002\u559C\u6E29\u6696\u6F6E\u6E7F\u73AF\u5883\uFF0C\u6781\u5177\u89C6\u89C9\u51B2\u51FB\u611F\u3002",
    careSecrets: "\u559C\u6E29\u6696\u6F6E\u6E7F\uFF0C\u5BF9\u5149\u5EA6\u8981\u6C42\u4E2D\u7B49\u3002\u907F\u514D\u76F4\u5C04\u5F3A\u5149\u707C\u4F24\u53F6\u7247\uFF0C\u6BCF\u6708\u7528\u7A00\u91CA\u80A5\u6C34\u8FFD\u65BD\u4E00\u6B21\u3002"
  },
  {
    id: "ep-2",
    name: "\u864E\u5C3E\u5170",
    latinName: "Sansevieria trifasciata",
    category: "\u5929\u95E8\u51AC\u79D1",
    lightRequirement: "low",
    toxicity: "safe",
    difficulty: "easy",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2qUCIlAV1OtgyY0Rvitf3RCKQZjLOw1e5LqajFK2XGkNXaJZ_PJbGG1wGbaaPD_EOzaTrAtk4SG9kvVA9J7pE2RZRJjYBciOdce_WbNSfJGy8WVpormYL_HOuL7Hb4zE-YWF0_XxtMkXZVHbPIIGfwWSsnv3Om6FBv-IvYuUV_uVZcg7sxgVUFXRZjTJUbFT0BAtN5pfultRwL_gh7fZPmDkAjh2n3Pf5RILzwrkmOtmzSdjaIEy4yaW-yQMlQ_fPBy8zgPunvw",
    waterRequirement: "\u8010\u65F1\uFF0C\u5E72\u900F\u6D47\u900F",
    description: "\u767E\u5408\u79D1\u864E\u5C3E\u5170\u5C5E\u591A\u5E74\u751F\u5E38\u7EFF\u8349\u672C\u3002\u53F6\u7247\u76F4\u7ACB\u575A\u633A\uFF0C\u5177\u767D\u7EFF\u76F8\u95F4\u7684\u6A2A\u5E26\u6591\u7EB9\u3002\u6781\u8010\u9634\u65F1\uFF0C\u51C0\u5316\u7A7A\u6C14\u4E4B\u738B\u3002",
    careSecrets: "\u6781\u5EA6\u8010\u65F1\uFF0C\u5207\u5FCC\u76C6\u571F\u79EF\u6C34\u3002\u51AC\u5B63\u6E29\u5EA6\u4F4E\u4E8E10\u5EA6\u9700\u65AD\u6C34\uFF0C\u9002\u5408\u7F6E\u4E8E\u5BA2\u5385\u534A\u9634\u5904\u51C0\u5316\u7A7A\u6C14\u3002"
  },
  {
    id: "ep-3",
    name: "\u7434\u53F6\u6995",
    latinName: "Ficus lyrata",
    category: "\u6851\u79D1",
    lightRequirement: "direct",
    toxicity: "toxic",
    difficulty: "medium",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoqSFcCZAV98t274qfMrv9l_sIR-sUYXWhoPGBd1PFMaPodrnmwTII1LwvdUK0TvkIOG3Y7Bl0tilp3HR9VuAK5Ob7IMpHRu_HCaVGvu1guxy6UFW1qSsvmcQ6HWsUQgZamcLdBODQXHgG83jxpzxlrEFUPUY4B_94bFAUunrX-zE8uFbghUugmCHnYUmL6Ek9kNiCLtk5zTDWRQplbZChF65KRuDL9Bfwg0ZaI3UuiifFjm6GgLAK_B0kOkuMXg8YyEdWcwRFLA",
    waterRequirement: "\u89C1\u5E72\u89C1\u6E7F\uFF0C\u907F\u514D\u79EF\u6C34",
    description: "\u6851\u79D1\u6995\u5C5E\u5E38\u7EFF\u4E54\u6728\u3002\u53F6\u7247\u7434\u5F62\uFF0C\u8D28\u786C\u633A\u62D4\uFF0C\u53F6\u8109\u6E05\u6670\uFF0C\u5BCC\u6709\u96D5\u5851\u822C\u7684\u73B0\u4EE3\u611F\u3002\u559C\u9633\u5149\u5145\u8DB3\u4E0E\u826F\u597D\u901A\u98CE\u3002",
    careSecrets: "\u5BF9\u4E8E\u7434\u53F6\u6995\uFF0C\u8FC7\u65E9\u6D47\u6C34\u4E0E\u4E0D\u900F\u98CE\u5BB9\u6613\u5F15\u8D77\u6839\u9645\u771F\u83CC\u4FB5\u67D3\u5E76\u5448\u7126\u9ED1\u6591\u3002\u63A8\u8350\u6BCF\u5468\u671D\u73AF\u5883\u7EC6\u96FE\u55B7\u6DCB\uFF0C\u76C6\u571F\u89C1\u5E72\u89C1\u6E7F\u3002"
  },
  {
    id: "ep-4",
    name: "\u91D1\u94B1\u6811",
    latinName: "Zamioculcas zamiifolia",
    category: "\u5929\u5357\u661F\u79D1",
    lightRequirement: "low",
    toxicity: "toxic",
    difficulty: "easy",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtKIC9CXVqAdffnoDZIDtSAB_Nm7DWy82R8kALw8nfrsOLRpukiQnW1k35rB4toXBjjUCIe1blzEI6bORdAAU_6VJM4kLINMOKULn5z1Jc_eIjtxXxEUbYGMPL90QhMSCRWx0XVwTVyNZOFPO0WmXFLF86yX_K7GQ0E34IBiNiudZHzPY06k1KM1nerFvxx7FkTyTXr3kqHj-ylXafNT_Y6UmWqT7JkhlhWu1yo8dTO5cyJ7Jp0E6sV3SDX_QNLjsfuV_OATwO5g",
    waterRequirement: "\u5E72\u900F\u6D47\u900F\uFF0C\u6781\u8010\u5E72\u65F1",
    description: "\u5730\u4E0A\u65E0\u4E3B\u830E\uFF0C\u53F6\u8F74\u76F4\u7ACB\u539A\u5B9E\uFF0C\u5C0F\u53F6\u5BF9\u751F\u539A\u5B9E\u5448\u9769\u8D28\uFF0C\u6CDB\u51FA\u4EAE\u4E3D\u6DF1\u7EFF\u3002\u62DB\u8D22\u5409\u7965\u3001\u4F4E\u7EF4\u62A4\u7684\u9996\u9009\u5BA4\u5185\u690D\u7269\u3002",
    careSecrets: "\u559C\u504F\u5E72\u6027\u57FA\u8D28\u3002\u8FC7\u5EA6\u591A\u6C34\u6613\u5F15\u8D77\u5757\u830E\u8150\u70C2\uFF0C\u5EFA\u8BAE\u4E24\u5468\u5DE6\u53F3\u6D47\u6C34\u4E00\u6B21\uFF0C\u4FDD\u6301\u901A\u98CE\u6563\u5149\u73AF\u5883\u3002"
  }
];
var INITIAL_POSTS = [
  {
    id: "post-1",
    title: void 0,
    content: "\u5468\u672B\u7684\u9633\u5149\u521A\u597D\uFF0C\u591A\u8089\u4EEC\u4F3C\u4E4E\u53C8\u80D6\u4E86\u4E00\u5708\u3002\u8BB0\u5F55\u4E00\u4E0B\u8FD9\u4E2A\u7F8E\u597D\u7684\u4E0B\u5348\u3002\u{1FAB4}",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtKIC9CXVqAdffnoDZIDtSAB_Nm7DWy82R8kALw8nfrsOLRpukiQnW1k35rB4toXBjjUCIe1blzEI6bORdAAU_6VJM4kLINMOKULn5z1Jc_eIjtxXxEUbYGMPL90QhMSCRWx0XVwTVyNZOFPO0WmXFLF86yX_K7GQ0E34IBiNiudZHzPY06k1KM1nerFvxx7FkTyTXr3kqHj-ylXafNT_Y6UmWqT7JkhlhWu1yo8dTO5cyJ7Jp0E6sV3SDX_QNLjsfuV_OATwO5g",
    author: {
      name: "\u6797\u95F4\u5C0F\u9E7F",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoud-nu574blFC1mHwwjImJX1cxz-YtqOyvyOCrCT8YDtRWcG0tvwG2GQgh8cLKWDKz4T80W7ezchEcJID6EzpNrrXBQTdSfcrN7GeFUzBwHV453Jp_AOV7znN8zbO6bHTw10yrzduZKpiHCuZMwISRRjs7tNVC50dplaE5rrAZd_zZsDT48g9aFtAfzjdBeJ4WAwgqbdf015pt6zjFoU03zq9TRnBjCi0-W9YW08qrfGHmPunb_G-4dRf1JCtctxUfQuR9m4kag",
      role: "\u591A\u8089\u7231\u597D\u8005"
    },
    likes: 128,
    commentsCount: 24,
    tag: "\u6211\u7684\u5BA4\u5185\u82B1\u56ED"
  },
  {
    id: "post-2",
    title: "\u6C42\u52A9\uFF1A\u9F9F\u80CC\u7AF9\u53F6\u5B50\u53D1\u9EC4\u662F\u600E\u4E48\u56DE\u4E8B\uFF1F",
    content: "\u6700\u8FD1\u521A\u4E70\u4E86\u4E00\u76C6\u9F9F\u80CC\u7AF9\uFF0C\u653E\u5728\u5BA2\u5385\u89D2\u843D\uFF0C\u8FD9\u51E0\u5929\u53D1\u73B0\u4E0B\u9762\u7684\u8001\u53F6\u5B50\u5F00\u59CB\u53D1\u9EC4\u4E86\uFF0C\u662F\u6C34\u6D47\u591A\u4E86\u8FD8\u662F\u7F3A\u5149\u7167\uFF1F\u6C42\u5927\u795E\u6307\u70B9\uFF01\u{1F64F}",
    image: void 0,
    author: {
      name: "\u9752\u9752\u5B50\u887F",
      avatar: "",
      role: "\u65B0\u624B\u517B\u82B1\u4EBA"
    },
    likes: 12,
    commentsCount: 45,
    tag: "\u65B0\u624B\u6C42\u52A9"
  },
  {
    id: "post-3",
    title: void 0,
    content: "\u7ECF\u8FC7\u4E00\u4E2A\u6708\u7684\u6539\u9020\uFF0C\u6211\u7684\u201C\u5BA4\u5185\u70ED\u5E26\u96E8\u6797\u201D\u7EC8\u4E8E\u521D\u5177\u89C4\u6A21\u5566\uFF01\u6BCF\u5929\u4E0B\u73ED\u56DE\u6765\u770B\u7740\u5B83\u4EEC\uFF0C\u611F\u89C9\u6240\u6709\u7684\u75B2\u60EB\u90FD\u6D88\u6563\u4E86\u3002",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI-4HmRW_b1Z5il_qjhWVH5-RNdZIkd0CuqZlfCSagD7i8P6w0WjTyuTHpxA2Wens3B_RunCnQvf4XEaS3hQVcGQ4HM9L2b8s69AYI4fCGIANd7XtNxzKq_W1UsVphkn7KIbJ9CzVhwyVcWS2qsR1D8uZUIZuKbh_Q1H9tQBNcaGKPNES3o0eLSZ-61TfP1augwOiZk_VhVaEGhSF06jgyzgDvFMvTg03se_YugTAgJwF4gj63hW2uL8hx8iIMkbwsVO-j2VsiwQ",
    author: {
      name: "Flora",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ-fVwNhrxyEzTxs24fL8HbLxAdDbPY7AN6vaUTJU6WoWKYECVfeTjOERBGDvfJHc0rPnoibeYow3fNXbZmuxHc9oFgwteb7JgsMcKthDu3tet31AgAOVM9NvKICGHqPzhEwpXbDMbyL46s1Te8itddYaRVPrCoBtZ3iJzXUdZT_H0E4CftiIDn2bSFFRhAgHUCVBwD_VlxloEpn43VJey1HVuKb0k3iYinh-ZQ7Fbxq-ebUITeSUanc4EV1K3UN0gEA6l0_SdXw",
      role: "\u9020\u666F\u5927\u5E08"
    },
    likes: 342,
    commentsCount: 56,
    tag: "\u9633\u53F0\u6539\u9020"
  }
];

// db.ts
var dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "micronature"
};
var pool = null;
var useFallback = false;
var fallbackUsers = [
  {
    id: "user-admin",
    username: "admin",
    password_hash: "$2a$10$y5V4bC2l5XUlytE/9Dbe/.oV/wKzVee21R4RzYV76sY.v6CjGzNle",
    // bcrypt for admin123
    email: "admin@micronature.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm7Jqsmi4-Pjxc_bnVemoEJXUfo1VGtYFKLkngzebR4kqoNegz4TuzHsX7_aruJtuDLt6HJ3a2dHC8Y_YJ4OF2NpKmQp8QyxomnlftsdsA9Lih3kVY-6CzCPHWLjT7zzY76DZf9MUd0h7tC3MyZxbe_OG38ccKHYZlyy_w1s-FORkU3Njccck8nVzhaLSGbNA0lU9A473bRvLmu_dfgYjRAvUkKXsTIdZlvF06WqNsZa0QN_q84Ne9LSvVy4BlTAYukNltsgOkWQ",
    role: "admin",
    bio: "\u7CFB\u7EDF\u7BA1\u7406\u5458\uFF0C\u8D1F\u8D23MicroNature\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u5BA1\u6838\u3002",
    exp: "expert",
    created_at: /* @__PURE__ */ new Date()
  },
  {
    id: "user-test",
    username: "user",
    password_hash: "$2a$10$tZ8.cWn.8h7dG3f9e2Bfe.D76S.h6fVvY2v6yZ56sY.v6CjGzNle",
    // bcrypt for user123
    email: "test@micronature.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoud-nu574blFC1mHwwjImJX1cxz-YtqOyvyOCrCT8YDtRWcG0tvwG2GQgh8cLKWDKz4T80W7ezchEcJID6EzpNrrXBQTdSfcrN7GeFUzBwHV453Jp_AOV7znN8zbO6bHTw10yrzduZKpiHCuZMwISRRjs7tNVC50dplaE5rrAZd_zZsDT48g9aFtAfzjdBeJ4WAwgqbdf015pt6zjFoU03zq9TRnBjCi0-W9YW08qrfGHmPunb_G-4dRf1JCtctxUfQuR9m4kag",
    role: "user",
    bio: "\u7231\u82B1\u82B1\u7231\u8349\u8349\u7684\u666E\u901A\u517B\u62A4\u8005\u3002",
    exp: "intermediate",
    created_at: /* @__PURE__ */ new Date()
  }
];
var fallbackPlants = JSON.parse(JSON.stringify(INITIAL_PLANTS)).map((p) => ({ ...p, userId: "user-test" }));
var fallbackTasks = JSON.parse(JSON.stringify(INITIAL_TASKS)).map((t) => ({ ...t, userId: "user-test" }));
var fallbackPosts = JSON.parse(JSON.stringify(INITIAL_POSTS)).map((p) => ({ ...p, userId: "user-test" }));
var fallbackEncyclopedia = JSON.parse(JSON.stringify(ENCYCLOPEDIA_PLANTS));
var fallbackComments = [
  { id: 1, postId: "post-1", author: "\u591A\u8089\u5C0F\u53EF\u7231", text: "\u771F\u7684\u53C8\u80D6\u4E00\u5708\u8036\uFF01\u4F60\u5E73\u65F6\u7684\u914D\u571F\u6BD4\u4F8B\u662F\u591A\u5C11\u5440\uFF1F", createdAt: /* @__PURE__ */ new Date() },
  { id: 2, postId: "post-1", author: "\u6797\u95F4\u5C0F\u9E7F", text: "\u6211\u7528\u7684\u662F\u8D64\u7389\u571F60% + \u6CE5\u70AD30% + \u9EA6\u996D\u77F310%\uFF0C\u900F\u6C14\u6548\u679C\u62C9\u6EE1\uFF01", createdAt: /* @__PURE__ */ new Date() },
  { id: 3, postId: "post-2", author: "\u690D\u7269\u533B\u751FAI", text: "\u4E0B\u65B9\u5927\u53F6\u53D1\u9EC4\u591A\u6570\u662F\u571F\u58E4\u8FC7\u5EA6\u79EF\u6C34\u5BFC\u81F4\u6839\u90E8\u7A92\u606F\u3002\u5EFA\u8BAE\u65AD\u6C34\u5E76\u632A\u81F3\u901A\u98CE\u5904\u3002", createdAt: /* @__PURE__ */ new Date() }
];
var fallbackTrafficLogs = [];
async function initializeDatabase() {
  try {
    console.log("\u6B63\u5728\u5C1D\u8BD5\u8FDE\u63A5 MySQL \u6570\u636E\u5E93...");
    const tempConnection = await import_promise.default.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempConnection.end();
    pool = import_promise.default.createPool(dbConfig);
    console.log("\u2714\uFE0E MySQL \u6570\u636E\u5E93\u8FDE\u63A5\u6C60\u5EFA\u7ACB\u6210\u529F\uFF01");
    await createTables();
    await seedTables();
  } catch (err) {
    console.warn("\n\u26A0\uFE0F \u65E0\u6CD5\u8FDE\u63A5\u5230 MySQL \u6570\u636E\u5E93\u3002");
    console.warn("\u9519\u8BEF\u539F\u56E0:", err.message || err.code || String(err));
    console.warn("\u{1F449} \u540E\u7AEF\u5C06\u81EA\u52A8\u8FD0\u884C\u5728\u3010\u5185\u5B58\u6A21\u62DF\u6A21\u5F0F\u3011\u4E0B\uFF0C\u6570\u636E\u66F4\u6539\u5728\u91CD\u542F\u540E\u4E0D\u4F1A\u6301\u4E45\u4FDD\u5B58\u3002");
    console.warn("\u{1F449} \u5982\u679C\u60A8\u60F3\u8981\u4F7F\u7528\u771F\u5B9E MySQL\uFF0C\u8BF7\u786E\u4FDD\u672C\u5730 MySQL \u670D\u52A1\u6B63\u5E38\u8FD0\u884C\uFF0C\u5E76\u521B\u5EFA\u6216\u68C0\u67E5\u9879\u76EE\u6839\u76EE\u5F55\u7684 .env \u6587\u4EF6\u3002\n");
    useFallback = true;
  }
}
async function createTables() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(150),
      avatar TEXT,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      bio TEXT,
      exp VARCHAR(20) DEFAULT 'beginner',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS plants (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      latinName VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'optimal',
      thumbnail TEXT NOT NULL,
      soilMoisture INT NOT NULL,
      soilStatus VARCHAR(100) NOT NULL,
      lightLevel INT NOT NULL,
      lightStatus VARCHAR(100) NOT NULL,
      category VARCHAR(100) NOT NULL,
      userId VARCHAR(50) NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS care_tasks (
      id VARCHAR(50) PRIMARY KEY,
      plantId VARCHAR(50) NOT NULL,
      taskName VARCHAR(255) NOT NULL,
      plantName VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE,
      description TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      userId VARCHAR(50) NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NULL,
      content TEXT NOT NULL,
      image TEXT NULL,
      authorName VARCHAR(255) NOT NULL,
      authorAvatar TEXT NOT NULL,
      authorRole VARCHAR(255) NOT NULL,
      likes INT NOT NULL DEFAULT 0,
      commentsCount INT NOT NULL DEFAULT 0,
      tag VARCHAR(100) NOT NULL,
      hasLiked BOOLEAN NOT NULL DEFAULT FALSE,
      userId VARCHAR(50) NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      postId VARCHAR(50) NOT NULL,
      author VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES community_posts(id) ON DELETE CASCADE
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS traffic_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      method VARCHAR(10) NOT NULL,
      url VARCHAR(255) NOT NULL,
      ip VARCHAR(45) NOT NULL,
      user_agent TEXT,
      latency INT NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS encyclopedia_plants (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      latinName VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      lightRequirement VARCHAR(50) NOT NULL,
      toxicity VARCHAR(50) NOT NULL,
      difficulty VARCHAR(50) NOT NULL,
      thumbnail TEXT NOT NULL,
      waterRequirement VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      careSecrets TEXT NULL
    )
  `);
  try {
    await pool.query("ALTER TABLE plants ADD COLUMN userId VARCHAR(50) NULL");
  } catch (e) {
  }
  try {
    await pool.query("ALTER TABLE care_tasks ADD COLUMN userId VARCHAR(50) NULL");
  } catch (e) {
  }
  try {
    await pool.query("ALTER TABLE community_posts ADD COLUMN userId VARCHAR(50) NULL");
  } catch (e) {
  }
  try {
    await pool.query("ALTER TABLE encyclopedia_plants ADD COLUMN careSecrets TEXT NULL");
  } catch (e) {
  }
}
async function seedTables() {
  if (!pool) return;
  const [userRows] = await pool.query("SELECT COUNT(*) as count FROM users");
  if (userRows[0].count === 0) {
    console.log("\u6B63\u5728\u521D\u59CB\u5316\u9ED8\u8BA4\u7528\u6237\u548C\u7BA1\u7406\u5458\u6570\u636E\u79CD\u5B50...");
    const adminPassHash = await import_bcryptjs.default.hash("admin123", 10);
    const userPassHash = await import_bcryptjs.default.hash("user123", 10);
    await pool.query(
      "INSERT INTO users (id, username, password_hash, email, avatar, role, bio, exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ["user-admin", "admin", adminPassHash, "admin@micronature.com", "https://lh3.googleusercontent.com/aida-public/AB6AXuBm7Jqsmi4-Pjxc_bnVemoEJXUfo1VGtYFKLkngzebR4kqoNegz4TuzHsX7_aruJtuDLt6HJ3a2dHC8Y_YJ4OF2NpKmQp8QyxomnlftsdsA9Lih3kVY-6CzCPHWLjT7zzY76DZf9MUd0h7tC3MyZxbe_OG38ccKHYZlyy_w1s-FORkU3Njccck8nVzhaLSGbNA0lU9A473bRvLmu_dfgYjRAvUkKXsTIdZlvF06WqNsZa0QN_q84Ne9LSvVy4BlTAYukNltsgOkWQ", "admin", "\u7CFB\u7EDF\u7BA1\u7406\u5458\uFF0C\u8D1F\u8D23MicroNature\u5E73\u53F0\u8FD0\u7EF4\u4E0E\u5BA1\u6838\u3002", "expert"]
    );
    await pool.query(
      "INSERT INTO users (id, username, password_hash, email, avatar, role, bio, exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ["user-test", "user", userPassHash, "test@micronature.com", "https://lh3.googleusercontent.com/aida-public/AB6AXuAoud-nu574blFC1mHwwjImJX1cxz-YtqOyvyOCrCT8YDtRWcG0tvwG2GQgh8cLKWDKz4T80W7ezchEcJID6EzpNrrXBQTdSfcrN7GeFUzBwHV453Jp_AOV7znN8zbO6bHTw10yrzduZKpiHCuZMwISRRjs7tNVC50dplaE5rrAZd_zZsDT48g9aFtAfzjdBeJ4WAwgqbdf015pt6zjFoU03zq9TRnBjCi0-W9YW08qrfGHmPunb_G-4dRf1JCtctxUfQuR9m4kag", "user", "\u7231\u82B1\u82B1\u7231\u8349\u8349\u7684\u666E\u901A\u517B\u62A4\u8005\u3002", "intermediate"]
    );
  }
  const [plantsRows] = await pool.query("SELECT COUNT(*) as count FROM plants");
  if (plantsRows[0].count === 0) {
    console.log("\u6B63\u5728\u521D\u59CB\u5316\u690D\u7269\u8868\u79CD\u5B50\u6570\u636E...");
    for (const p of INITIAL_PLANTS) {
      await pool.query(
        "INSERT INTO plants (id, name, latinName, status, thumbnail, soilMoisture, soilStatus, lightLevel, lightStatus, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [p.id, p.name, p.latinName, p.status, p.thumbnail, p.soilMoisture, p.soilStatus, p.lightLevel, p.lightStatus, p.category, "user-test"]
      );
    }
  }
  const [tasksRows] = await pool.query("SELECT COUNT(*) as count FROM care_tasks");
  if (tasksRows[0].count === 0) {
    console.log("\u6B63\u5728\u521D\u59CB\u5316\u517B\u62A4\u4EFB\u52A1\u8868\u79CD\u5B50\u6570\u636E...");
    for (const t of INITIAL_TASKS) {
      await pool.query(
        "INSERT INTO care_tasks (id, plantId, taskName, plantName, category, done, description, thumbnail, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [t.id, t.plantId, t.taskName, t.plantName, t.category, t.done, t.description, t.thumbnail, "user-test"]
      );
    }
  }
  const [postsRows] = await pool.query("SELECT COUNT(*) as count FROM community_posts");
  if (postsRows[0].count === 0) {
    console.log("\u6B63\u5728\u521D\u59CB\u5316\u793E\u533A\u65E5\u5FD7\u8868\u79CD\u5B50\u6570\u636E...");
    for (const post of INITIAL_POSTS) {
      await pool.query(
        "INSERT INTO community_posts (id, title, content, image, authorName, authorAvatar, authorRole, likes, commentsCount, tag, hasLiked, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          post.id,
          post.title || null,
          post.content,
          post.image || null,
          post.author.name,
          post.author.avatar,
          post.author.role,
          post.likes,
          post.commentsCount,
          post.tag,
          post.hasLiked || false,
          "user-test"
        ]
      );
    }
    console.log("\u6B63\u5728\u521D\u59CB\u5316\u793E\u533A\u65E5\u5FD7\u8BC4\u8BBA\u79CD\u5B50\u6570\u636E...");
    for (const comment of fallbackComments) {
      await pool.query(
        "INSERT INTO comments (postId, author, text) VALUES (?, ?, ?)",
        [comment.postId, comment.author, comment.text]
      );
    }
  }
  const [encRows] = await pool.query("SELECT COUNT(*) as count FROM encyclopedia_plants");
  if (encRows[0].count === 0) {
    console.log("\u6B63\u5728\u521D\u59CB\u5316\u79D1\u666E\u767E\u79D1\u6570\u636E\u79CD\u5B50...");
    for (const ep of ENCYCLOPEDIA_PLANTS) {
      await pool.query(
        "INSERT INTO encyclopedia_plants (id, name, latinName, category, lightRequirement, toxicity, difficulty, thumbnail, waterRequirement, description, careSecrets) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [ep.id, ep.name, ep.latinName, ep.category, ep.lightRequirement, ep.toxicity, ep.difficulty, ep.thumbnail, ep.waterRequirement, ep.description, ep.careSecrets]
      );
    }
  } else {
    for (const ep of ENCYCLOPEDIA_PLANTS) {
      await pool.query(
        "UPDATE encyclopedia_plants SET careSecrets = ? WHERE id = ? AND careSecrets IS NULL",
        [ep.careSecrets, ep.id]
      );
    }
  }
}
async function getPlants(userId) {
  if (useFallback || !pool) {
    if (!userId) return fallbackPlants;
    return fallbackPlants.filter((p) => p.userId === userId);
  }
  if (!userId) {
    const [rows2] = await pool.query("SELECT * FROM plants");
    return rows2;
  }
  const [rows] = await pool.query("SELECT * FROM plants WHERE userId = ?", [userId]);
  return rows;
}
async function addPlant(plant, userId) {
  const finalPlant = { ...plant, userId };
  if (useFallback || !pool) {
    fallbackPlants.push(finalPlant);
    return finalPlant;
  }
  await pool.query(
    "INSERT INTO plants (id, name, latinName, status, thumbnail, soilMoisture, soilStatus, lightLevel, lightStatus, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [plant.id, plant.name, plant.latinName, plant.status, plant.thumbnail, plant.soilMoisture, plant.soilStatus, plant.lightLevel, plant.lightStatus, plant.category, userId]
  );
  return finalPlant;
}
async function deletePlant(id, userId) {
  if (useFallback || !pool) {
    fallbackPlants = fallbackPlants.filter((p) => {
      if (userId && p.userId !== userId) return true;
      return p.id !== id;
    });
    fallbackTasks = fallbackTasks.filter((t) => {
      if (userId && t.userId !== userId) return true;
      return t.plantId !== id;
    });
    return { success: true };
  }
  if (userId) {
    await pool.query("DELETE FROM plants WHERE id = ? AND userId = ?", [id, userId]);
    await pool.query("DELETE FROM care_tasks WHERE plantId = ? AND userId = ?", [id, userId]);
  } else {
    await pool.query("DELETE FROM plants WHERE id = ?", [id]);
    await pool.query("DELETE FROM care_tasks WHERE plantId = ?", [id]);
  }
  return { success: true };
}
async function waterPlant(id, userId) {
  if (useFallback || !pool) {
    let updatedPlant = null;
    fallbackPlants = fallbackPlants.map((p2) => {
      if (p2.id === id && (!userId || p2.userId === userId)) {
        const nextMoisture2 = Math.min(100, p2.soilMoisture + 40);
        updatedPlant = {
          ...p2,
          soilMoisture: nextMoisture2,
          soilStatus: `${nextMoisture2}% (\u5DF2\u704C\u6E89\u6EA2\u6EE1)`,
          status: nextMoisture2 >= 40 && nextMoisture2 <= 85 ? "optimal" : "warning"
        };
        return updatedPlant;
      }
      return p2;
    });
    return updatedPlant;
  }
  let rows = [];
  if (userId) {
    const [result] = await pool.query("SELECT * FROM plants WHERE id = ? AND userId = ?", [id, userId]);
    rows = result;
  } else {
    const [result] = await pool.query("SELECT * FROM plants WHERE id = ?", [id]);
    rows = result;
  }
  if (rows.length === 0) return null;
  const p = rows[0];
  const nextMoisture = Math.min(100, p.soilMoisture + 40);
  const status = nextMoisture >= 40 && nextMoisture <= 85 ? "optimal" : "warning";
  const soilStatus = `${nextMoisture}% (\u5DF2\u704C\u6E89\u6EA2\u6EE1)`;
  await pool.query(
    "UPDATE plants SET soilMoisture = ?, soilStatus = ?, status = ? WHERE id = ?",
    [nextMoisture, soilStatus, status, id]
  );
  return { ...p, soilMoisture: nextMoisture, soilStatus, status };
}
async function fertilizePlant(id, userId) {
  if (useFallback || !pool) {
    let updatedPlant = null;
    fallbackPlants = fallbackPlants.map((p2) => {
      if (p2.id === id && (!userId || p2.userId === userId)) {
        updatedPlant = {
          ...p2,
          soilStatus: `${p2.soilMoisture}% (\u5E95\u80A5\u5DF2\u6DF1\u57CB)`,
          status: "optimal"
        };
        return updatedPlant;
      }
      return p2;
    });
    return updatedPlant;
  }
  let rows = [];
  if (userId) {
    const [result] = await pool.query("SELECT * FROM plants WHERE id = ? AND userId = ?", [id, userId]);
    rows = result;
  } else {
    const [result] = await pool.query("SELECT * FROM plants WHERE id = ?", [id]);
    rows = result;
  }
  if (rows.length === 0) return null;
  const p = rows[0];
  const soilStatus = `${p.soilMoisture}% (\u5E95\u80A5\u5DF2\u6DF1\u57CB)`;
  const status = "optimal";
  await pool.query(
    "UPDATE plants SET soilStatus = ?, status = ? WHERE id = ?",
    [soilStatus, status, id]
  );
  return { ...p, soilStatus, status };
}
async function getTasks(userId) {
  if (useFallback || !pool) {
    if (!userId) return fallbackTasks;
    return fallbackTasks.filter((t) => t.userId === userId);
  }
  if (!userId) {
    const [rows2] = await pool.query("SELECT * FROM care_tasks ORDER BY done ASC, id DESC");
    return rows2;
  }
  const [rows] = await pool.query("SELECT * FROM care_tasks WHERE userId = ? ORDER BY done ASC, id DESC", [userId]);
  return rows;
}
async function addTask(task, userId) {
  const finalTask = { ...task, done: false, userId };
  if (useFallback || !pool) {
    fallbackTasks.unshift(finalTask);
    return finalTask;
  }
  await pool.query(
    "INSERT INTO care_tasks (id, plantId, taskName, plantName, category, done, description, thumbnail, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [task.id, task.plantId, task.taskName, task.plantName, task.category, 0, task.description, task.thumbnail, userId]
  );
  return finalTask;
}
async function toggleTask(id, userId) {
  if (useFallback || !pool) {
    let updatedTask = null;
    fallbackTasks = fallbackTasks.map((t2) => {
      if (t2.id === id && (!userId || t2.userId === userId)) {
        updatedTask = { ...t2, done: !t2.done };
        return updatedTask;
      }
      return t2;
    });
    return updatedTask;
  }
  let rows = [];
  if (userId) {
    const [result] = await pool.query("SELECT * FROM care_tasks WHERE id = ? AND userId = ?", [id, userId]);
    rows = result;
  } else {
    const [result] = await pool.query("SELECT * FROM care_tasks WHERE id = ?", [id]);
    rows = result;
  }
  if (rows.length === 0) return null;
  const t = rows[0];
  const nextDone = t.done ? 0 : 1;
  await pool.query("UPDATE care_tasks SET done = ? WHERE id = ?", [nextDone, id]);
  return { ...t, done: !!nextDone };
}
async function getPosts(userId) {
  if (useFallback || !pool) {
    const matchedPosts = userId ? fallbackPosts.filter((post) => post.userId === userId) : fallbackPosts;
    return matchedPosts.map((post) => {
      const comments2 = fallbackComments.filter((c) => c.postId === post.id).map((c) => ({ author: c.author, text: c.text }));
      return { ...post, comments: comments2 };
    });
  }
  let posts = [];
  if (userId) {
    const [result] = await pool.query("SELECT * FROM community_posts WHERE userId = ? ORDER BY id DESC", [userId]);
    posts = result;
  } else {
    const [result] = await pool.query("SELECT * FROM community_posts ORDER BY id DESC");
    posts = result;
  }
  const [comments] = await pool.query("SELECT * FROM comments ORDER BY id ASC");
  return posts.map((post) => {
    const postComments = comments.filter((c) => c.postId === post.id).map((c) => ({ author: c.author, text: c.text }));
    return {
      id: post.id,
      title: post.title || void 0,
      content: post.content,
      image: post.image || void 0,
      author: {
        name: post.authorName,
        avatar: post.authorAvatar,
        role: post.authorRole
      },
      likes: post.likes,
      commentsCount: post.commentsCount,
      tag: post.tag,
      hasLiked: !!post.hasLiked,
      comments: postComments,
      userId: post.userId
    };
  });
}
async function addPost(post, userId) {
  const finalPost = { ...post, userId };
  if (useFallback || !pool) {
    fallbackPosts.unshift(finalPost);
    return finalPost;
  }
  await pool.query(
    "INSERT INTO community_posts (id, title, content, image, authorName, authorAvatar, authorRole, likes, commentsCount, tag, hasLiked, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      post.id,
      post.title || null,
      post.content,
      post.image || null,
      post.author.name,
      post.author.avatar,
      post.author.role,
      post.likes,
      post.commentsCount,
      post.tag,
      post.hasLiked ? 1 : 0,
      userId
    ]
  );
  return finalPost;
}
async function deletePost(id, userId) {
  if (useFallback || !pool) {
    fallbackPosts = fallbackPosts.filter((p) => {
      if (userId && p.userId !== userId) return true;
      return p.id !== id;
    });
    return { success: true };
  }
  if (userId) {
    await pool.query("DELETE FROM community_posts WHERE id = ? AND userId = ?", [id, userId]);
  } else {
    await pool.query("DELETE FROM community_posts WHERE id = ?", [id]);
  }
  return { success: true };
}
async function likePost(id) {
  if (useFallback || !pool) {
    let updatedPost = null;
    fallbackPosts = fallbackPosts.map((post2) => {
      if (post2.id === id) {
        const nextHasLiked2 = !post2.hasLiked;
        updatedPost = {
          ...post2,
          hasLiked: nextHasLiked2,
          likes: nextHasLiked2 ? post2.likes + 1 : post2.likes - 1
        };
        return updatedPost;
      }
      return post2;
    });
    return updatedPost;
  }
  const [rows] = await pool.query("SELECT * FROM community_posts WHERE id = ?", [id]);
  if (rows.length === 0) return null;
  const post = rows[0];
  const nextHasLiked = post.hasLiked ? 0 : 1;
  const nextLikes = nextHasLiked ? post.likes + 1 : post.likes - 1;
  await pool.query(
    "UPDATE community_posts SET hasLiked = ?, likes = ? WHERE id = ?",
    [nextHasLiked, nextLikes, id]
  );
  return { ...post, hasLiked: !!nextHasLiked, likes: nextLikes };
}
async function addComment(postId, author, text) {
  if (useFallback || !pool) {
    const newId = fallbackComments.length + 1;
    const comment = { id: newId, postId, author, text, createdAt: /* @__PURE__ */ new Date() };
    fallbackComments.push(comment);
    fallbackPosts = fallbackPosts.map((post) => {
      if (post.id === postId) {
        return { ...post, commentsCount: post.commentsCount + 1 };
      }
      return post;
    });
    return comment;
  }
  await pool.query(
    "INSERT INTO comments (postId, author, text) VALUES (?, ?, ?)",
    [postId, author, text]
  );
  await pool.query(
    "UPDATE community_posts SET commentsCount = commentsCount + 1 WHERE id = ?",
    [postId]
  );
  return { postId, author, text };
}
async function getUserByUsername(username) {
  if (useFallback || !pool) {
    return fallbackUsers.find((u) => u.username === username) || null;
  }
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows.length > 0 ? rows[0] : null;
}
async function getUserById(id) {
  if (useFallback || !pool) {
    return fallbackUsers.find((u) => u.id === id) || null;
  }
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
}
async function createUser(user) {
  if (useFallback || !pool) {
    fallbackUsers.push(user);
    return user;
  }
  await pool.query(
    "INSERT INTO users (id, username, password_hash, email, avatar, role, bio, exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [user.id, user.username, user.password_hash, user.email || null, user.avatar || null, user.role || "user", user.bio || null, user.exp || "beginner"]
  );
  return user;
}
async function getAllUsers() {
  if (useFallback || !pool) {
    return fallbackUsers;
  }
  const [rows] = await pool.query("SELECT id, username, email, avatar, role, bio, exp, created_at FROM users");
  return rows;
}
async function updateUser(userId, data) {
  if (useFallback || !pool) {
    fallbackUsers = fallbackUsers.map((u) => {
      if (u.id === userId) {
        return { ...u, ...data };
      }
      return u;
    });
    return true;
  }
  const keys = Object.keys(data);
  if (keys.length === 0) return true;
  const setClause = keys.map((k) => `\`${k}\` = ?`).join(", ");
  const values = Object.values(data);
  await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, userId]);
  return true;
}
async function deleteUser(userId) {
  if (useFallback || !pool) {
    fallbackUsers = fallbackUsers.filter((u) => u.id !== userId);
    return true;
  }
  await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  return true;
}
async function logTraffic(log) {
  if (useFallback || !pool) {
    fallbackTrafficLogs.push({ ...log, timestamp: /* @__PURE__ */ new Date() });
    return;
  }
  try {
    await pool.query(
      "INSERT INTO traffic_logs (method, url, ip, user_agent, latency) VALUES (?, ?, ?, ?, ?)",
      [log.method, log.url, log.ip, log.userAgent, log.latency]
    );
  } catch (err) {
    console.error("Failed to insert traffic log:", err);
  }
}
async function getAnalytics() {
  if (useFallback || !pool) {
    const pv = fallbackTrafficLogs.length;
    const ips = new Set(fallbackTrafficLogs.map((l) => l.ip));
    const uv = ips.size;
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = new Date(Date.now() - i * 24 * 3600 * 1e3).toISOString().split("T")[0];
      dailyStats.push({
        date: dateStr,
        pv: Math.floor(Math.random() * 20) + 10,
        uv: Math.floor(Math.random() * 5) + 2
      });
    }
    return {
      totalPV: pv || 154,
      totalUV: uv || 23,
      avgLatency: 75,
      dailyStats,
      popularEndpoints: [
        { method: "GET", url: "/api/plants", count: 85 },
        { method: "POST", url: "/api/gemini/diagnose", count: 42 },
        { method: "GET", url: "/api/tasks", count: 35 }
      ]
    };
  }
  try {
    const [pvRows] = await pool.query("SELECT COUNT(*) as count FROM traffic_logs");
    const [uvRows] = await pool.query("SELECT COUNT(DISTINCT ip) as count FROM traffic_logs");
    const [latencyRows] = await pool.query("SELECT AVG(latency) as avg FROM traffic_logs");
    const [chartRows] = await pool.query(`
      SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') as date, COUNT(*) as pv, COUNT(DISTINCT ip) as uv
      FROM traffic_logs
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d')
      ORDER BY date ASC
    `);
    const [endpointRows] = await pool.query(`
      SELECT method, url, COUNT(*) as count
      FROM traffic_logs
      GROUP BY method, url
      ORDER BY count DESC
      LIMIT 5
    `);
    return {
      totalPV: pvRows[0].count,
      totalUV: uvRows[0].count,
      avgLatency: Math.round(latencyRows[0].avg || 0),
      dailyStats: chartRows,
      popularEndpoints: endpointRows
    };
  } catch (err) {
    console.error("Failed to query database analytics:", err);
    return {
      totalPV: 0,
      totalUV: 0,
      avgLatency: 0,
      dailyStats: [],
      popularEndpoints: []
    };
  }
}
async function getEncyclopedia() {
  if (useFallback || !pool) return fallbackEncyclopedia;
  const [rows] = await pool.query("SELECT * FROM encyclopedia_plants");
  return rows;
}
async function addEncyclopedia(ep) {
  if (useFallback || !pool) {
    fallbackEncyclopedia.push(ep);
    return ep;
  }
  await pool.query(
    "INSERT INTO encyclopedia_plants (id, name, latinName, category, lightRequirement, toxicity, difficulty, thumbnail, waterRequirement, description, careSecrets) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [ep.id, ep.name, ep.latinName, ep.category, ep.lightRequirement, ep.toxicity, ep.difficulty, ep.thumbnail, ep.waterRequirement, ep.description, ep.careSecrets]
  );
  return ep;
}
async function updateEncyclopedia(id, ep) {
  if (useFallback || !pool) {
    fallbackEncyclopedia = fallbackEncyclopedia.map((item) => item.id === id ? { ...item, ...ep } : item);
    return { success: true };
  }
  const keys = Object.keys(ep);
  if (keys.length === 0) return { success: true };
  const setClause = keys.map((k) => `\`${k}\` = ?`).join(", ");
  const values = Object.values(ep);
  await pool.query(`UPDATE encyclopedia_plants SET ${setClause} WHERE id = ?`, [...values, id]);
  return { success: true };
}
async function deleteEncyclopedia(id) {
  if (useFallback || !pool) {
    fallbackEncyclopedia = fallbackEncyclopedia.filter((item) => item.id !== id);
    return { success: true };
  }
  await pool.query("DELETE FROM encyclopedia_plants WHERE id = ?", [id]);
  return { success: true };
}

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
var JWT_SECRET = process.env.JWT_SECRET || "micronature_jwt_secret_key_2026";
app.use(import_express.default.json());
var uploadsDir = import_path.default.join(process.cwd(), "public", "uploads");
if (!import_fs.default.existsSync(import_path.default.join(process.cwd(), "public"))) {
  import_fs.default.mkdirSync(import_path.default.join(process.cwd(), "public"));
}
if (!import_fs.default.existsSync(uploadsDir)) {
  import_fs.default.mkdirSync(uploadsDir);
}
app.use("/uploads", import_express.default.static(uploadsDir));
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.url.startsWith("/api")) {
      logTraffic({
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip || req.socket.remoteAddress || "unknown",
        userAgent: req.headers["user-agent"] || "",
        latency: duration
      }).catch((err) => console.error("Telemetry error:", err));
    }
  });
  next();
});
var authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    import_jsonwebtoken.default.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: "Invalid or expired token" });
        return;
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
var requireAdmin = (req, res, next) => {
  const user = req.user;
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admin access required" });
  }
};
var storage = import_multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = import_path.default.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});
var upload = (0, import_multer.default)({ storage });
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    aiClient = new import_genai.GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.post("/api/auth/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  try {
    const existing = await getUserByUsername(username);
    if (existing) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }
    const password_hash = await import_bcryptjs2.default.hash(password, 10);
    const id = `user-${Date.now()}`;
    const user = {
      id,
      username,
      password_hash,
      email,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoud-nu574blFC1mHwwjImJX1cxz-YtqOyvyOCrCT8YDtRWcG0tvwG2GQgh8cLKWDKz4T80W7ezchEcJID6EzpNrrXBQTdSfcrN7GeFUzBwHV453Jp_AOV7znN8zbO6bHTw10yrzduZKpiHCuZMwISRRjs7tNVC50dplaE5rrAZd_zZsDT48g9aFtAfzjdBeJ4WAwgqbdf015pt6zjFoU03zq9TRnBjCi0-W9YW08qrfGHmPunb_G-4dRf1JCtctxUfQuR9m4kag",
      role: "user",
      bio: "\u65B0\u664B\u7EFF\u690D\u4E3B\u7406\u4EBA",
      exp: "beginner"
    };
    await createUser(user);
    const token = import_jsonwebtoken.default.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, username: user.username, role: user.role, avatar: user.avatar, email: user.email, bio: user.bio, exp: user.exp } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const match = await import_bcryptjs2.default.compare(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const token = import_jsonwebtoken.default.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, avatar: user.avatar, email: user.email, bio: user.bio, exp: user.exp } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/auth/me", authenticateJWT, async (req, res) => {
  try {
    const jwtUser = req.user;
    const user = await getUserById(jwtUser.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ id: user.id, username: user.username, role: user.role, avatar: user.avatar, email: user.email, bio: user.bio, exp: user.exp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/auth/profile", authenticateJWT, async (req, res) => {
  try {
    const jwtUser = req.user;
    const { name, email, avatar, role, exp, bio } = req.body;
    const updateData = {
      username: name,
      email,
      avatar,
      role,
      exp,
      bio
    };
    await updateUser(jwtUser.id, updateData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/upload", authenticateJWT, upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const hasCloudConfig = process.env.OSS_ACCESS_KEY_ID && process.env.OSS_ACCESS_KEY_SECRET && process.env.OSS_BUCKET && process.env.OSS_ENDPOINT;
  if (hasCloudConfig) {
    console.log("\u2601\uFE0F Connected to Cloud Object Storage - Uploading:", req.file.filename);
    const cloudUrl = `https://${process.env.OSS_BUCKET}.${process.env.OSS_ENDPOINT}/${req.file.filename}`;
    res.json({ url: cloudUrl });
  } else {
    const localUrl = `/uploads/${req.file.filename}`;
    res.json({ url: localUrl });
  }
});
app.post("/api/gemini/diagnose", authenticateJWT, async (req, res) => {
  const { plantName, symtom, waterLevel, lightLevel } = req.body;
  if (!plantName) {
    res.status(400).json({ error: "Missing plantName" });
    return;
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    setTimeout(() => {
      res.json({
        diagnosis: `### \u{1FA7A} \u8BCA\u65AD\u62A5\u544A\uFF1A${plantName}

**\u{1F4A1} \u5F02\u5E38\u5206\u6790\uFF1A**
\u6839\u636E\u60A8\u63D0\u4EA4\u7684\u517B\u62A4\u6570\u636E\uFF08\u5F53\u524D\u571F\u58E4\u6C34\u5206\uFF1A${waterLevel || "\u672A\u77E5"}%\uFF0C\u5F53\u524D\u5149\u7167\u7A0B\u5EA6\uFF1A${lightLevel || "\u672A\u77E5"}%\uFF09\uFF0C\u4EE5\u53CA\u53CD\u9988\u7684\u75C7\u72B6\u300C${symtom || "\u6B63\u5E38\u65E0\u5F02\u6837"}\u300D\uFF0C\u6211\u4EEC\u5224\u65AD\uFF1A
- \u6C34\u5206\u4E0D\u8DB3\u6216\u7A7A\u6C14\u6E7F\u5EA6\u6781\u4F4E\uFF1A\u5F53\u524D\u6C34\u5206\u72B6\u6001\u4E0B\uFF0C${plantName} \u7684\u6BDB\u7EC6\u6839\u53D7\u635F\uFF0C\u65E0\u6CD5\u5411\u4E0A\u5C42\u53F6\u7247\u8F93\u9001\u6C34\u5206\uFF0C\u5BFC\u81F4\u7EC6\u80DE\u5931\u6C34\u840E\u852B\u3002

**\u270D\uFE0F \u7ACB\u5373\u5BF9\u7B56\uFF1A**
1. **\u6052\u6E29\u6D47\u6C34\uFF1A** \u9A6C\u4E0A\u6E29\u548C\u4E14\u5E72\u900F\u6D47\u704C\uFF0C\u4F7F\u6C34\u4ECE\u76D8\u5E95\u6790\u51FA\u4E3A\u6B62\u3002\u907F\u514D\u79EF\u6C34\u3002
2. **\u5FAE\u96E8\u55B7\u96FE\uFF1A** \u5BF9\u7A7A\u6C14\u53F6\u9762\u55B7\u96FE\uFF0C\u8C03\u9AD8\u76F8\u5BF9\u6E7F\u5EA6\u3002
3. **\u4F4D\u7F6E\u8C03\u6574\uFF1A** \u79FB\u9001\u81F3\u6709\u6EE4\u5149\u906E\u9634\u7684\u6E29\u6696\u534A\u9634\u5904\u3002`,
        suggestedMoisture: 55,
        confidence: "\u9AD8",
        model: "Offline Simulator (\u914D\u7F6E GEMINI_API_KEY \u5373\u53EF\u89E3\u9501\u771F\u673A\u5B9E\u65F6AI\u63A8\u8350)"
      });
    }, 1e3);
    return;
  }
  try {
    const ai = getGeminiClient();
    const systemInstruction = "\u4F60\u662F\u4E00\u4F4D\u7CBE\u901A\u5BA4\u5185\u7EFF\u690D\u75C5\u5BB3\u8BCA\u6CBB\u4E0E\u667A\u80FD\u9020\u666F\u7684\u2018\u690D\u7269\u533B\u751F\u2019\uFF0C\u80FD\u591F\u7ED9\u51FA\u4EB2\u5207\u3001\u4E13\u4E1A\u4E14\u5BCC\u6709\u8BD7\u610F\u7684\u56ED\u827A\u5EFA\u8BAE\u3002\u8BF7\u7528 Markdown \u683C\u5F0F\u8F93\u51FA\u3002";
    const prompt = `\u6211\u7684\u690D\u7269\u662F\uFF1A\u300C${plantName}\u300D\uFF0C\u5B83\u73B0\u5728\u7684\u75C7\u72B6\u6216\u8BC9\u6C42\u662F\uFF1A\u300C${symtom || "\u6B63\u5E38\u517B\u62A4"}\u300D\u3002
\u5F53\u524D\u571F\u58E4\u6C34\u5206\u4E3A ${waterLevel || "\u672A\u77E5"}%\uFF0C\u5F53\u524D\u627F\u53D7\u7684\u5149\u7167\u5EA6\u662F ${lightLevel || "\u672A\u77E5"}%\u3002

\u8BF7\u7ED9\u51FA\u4E00\u4EFD\u9488\u5BF9\u8BE5\u690D\u7269\u7684\u7EFF\u690D\u667A\u80FD\u8BCA\u65AD\u62A5\u544A\uFF0C\u5305\u542B\u4EE5\u4E0B\u51E0\u90E8\u5206\uFF08\u7528\u4F18\u96C5\u6392\u7248\u7684 markdown \u56DE\u590D\uFF09\uFF1A
- \u{1FA7A} **\u75C5\u60C5\u4E0E\u5FAE\u751F\u6001\u8BC4\u4F30** (\u7ED3\u5408\u6C34\u5206 and \u5149\u7167\u5224\u65AD\u5176\u5065\u5EB7\u72B6\u6001)
- \u270D\uFE0F **\u7D27\u6025\u590D\u82CF\u6307\u5357** (\u7ED9\u51FA\u6700\u76F4\u63A5\u4E14\u6613\u6267\u884C\u7684\u624B\u52A8\u517B\u62A4\u6B65\u9AA4\uFF0C\u5982\u6D47\u6C34\u3001\u4FEE\u526A\u7B49)
- \u2600\uFE0F **\u957F\u671F\u5FAE\u6C14\u5019\u91CD\u5851\u5EFA\u8BAE** (\u5728\u672A\u6765\u7684\u5149\u7167\u3001\u6E7F\u5EA6\u3001\u65BD\u80A5\u65B9\u9762\u7684\u8BE6\u7EC6\u5468\u671F\u63A8\u8350)
- \u{1F4E6} **\u9020\u666F\u642D\u914D\u4F19\u4F34** (\u63A8\u83501-2\u79CD\u9002\u5408\u4E0E\u6B64\u690D\u7269\u5171\u751F\u548C\u89C6\u89C9\u76F8\u914D\u7684\u57FA\u8D28\u6216\u5B83\u4F34\u751F\u6001\u690D\u7269)`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    res.json({
      diagnosis: response.text || "\u8BCA\u65AD\u5931\u8D25\uFF0C\u672A\u80FD\u751F\u6210\u56DE\u7B54\u3002",
      suggestedMoisture: 50,
      confidence: "\u9AD8",
      model: "gemini-3.5-flash"
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Gemini \u8BCA\u65AD\u670D\u52A1\u6682\u65F6\u65E0\u6CD5\u8FDE\u63A5",
      details: error.message || String(error)
    });
  }
});
app.get("/api/plants", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const list = await getPlants(user.role === "admin" ? void 0 : user.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/plants", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const plant = await addPlant(req.body, user.id);
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/plants/:id", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const result = await deletePlant(req.params.id, user.role === "admin" ? void 0 : user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/plants/:id/water", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const plant = await waterPlant(req.params.id, user.role === "admin" ? void 0 : user.id);
    if (!plant) {
      res.status(404).json({ error: "Plant not found or unauthorized" });
      return;
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/plants/:id/fertilize", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const plant = await fertilizePlant(req.params.id, user.role === "admin" ? void 0 : user.id);
    if (!plant) {
      res.status(404).json({ error: "Plant not found or unauthorized" });
      return;
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/tasks", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const list = await getTasks(user.role === "admin" ? void 0 : user.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/tasks", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const task = await addTask(req.body, user.id);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/tasks/:id/toggle", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const task = await toggleTask(req.params.id, user.role === "admin" ? void 0 : user.id);
    if (!task) {
      res.status(404).json({ error: "Task not found or unauthorized" });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/posts", async (req, res) => {
  try {
    const list = await getPosts();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/posts", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const post = await addPost(req.body, user.id);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/posts/:id", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const result = await deletePost(req.params.id, user.role === "admin" ? void 0 : user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/posts/:id/like", authenticateJWT, async (req, res) => {
  try {
    const post = await likePost(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/posts/:id/comments", authenticateJWT, async (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) {
    res.status(400).json({ error: "Missing author or text" });
    return;
  }
  try {
    const comment = await addComment(req.params.id, author, text);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/admin/users", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/admin/users/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { role, exp } = req.body;
    await updateUser(req.params.id, { role, exp });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/admin/users/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/admin/analytics", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const stats = await getAnalytics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/encyclopedia", async (req, res) => {
  try {
    const list = await getEncyclopedia();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/admin/encyclopedia", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const plant = await addEncyclopedia(req.body);
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/admin/encyclopedia/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const result = await updateEncyclopedia(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/admin/encyclopedia/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const result = await deleteEncyclopedia(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
async function setupServer() {
  await initializeDatabase();
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
setupServer();
//# sourceMappingURL=server.cjs.map
