import { Plant, CareTask, EncyclopediaPlant, CommunityPost, LandscapingMaterial, InspirationItem } from './types';

// Hotlinked images from HTML mocks for exact layout match
export const BRAND_IMAGES = {
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

// 1. Initial User's Plants
export const INITIAL_PLANTS: Plant[] = [
  {
    id: "plant-1",
    name: "大厅琴叶榕",
    latinName: "Ficus lyrata",
    status: "warning",
    thumbnail: BRAND_IMAGES.fiddleFigWide,
    soilMoisture: 20,
    soilStatus: "20% (过低)",
    lightLevel: 70,
    lightStatus: "适宜",
    category: "天南星科"
  },
  {
    id: "plant-2",
    name: "卧室龟背竹",
    latinName: "Monstera deliciosa",
    status: "optimal",
    thumbnail: BRAND_IMAGES.monsteraWide,
    soilMoisture: 60,
    soilStatus: "60% (适宜)",
    lightLevel: 80,
    lightStatus: "适宜",
    category: "天南星科"
  }
];

// 2. Care Tasks for Care Workbench
export const INITIAL_TASKS: CareTask[] = [
  {
    id: "task-1",
    plantId: "plant-1",
    taskName: "给琴叶榕浇水",
    plantName: "大厅琴叶榕",
    category: "watering",
    done: false,
    description: "已逾期 1 天 • 需水量：中等",
    thumbnail: BRAND_IMAGES.fiddleFigCloseup
  },
  {
    id: "task-2",
    plantId: "plant-2",
    taskName: "为龟背竹施肥",
    plantName: "卧室龟背竹",
    category: "fertilizer",
    done: false,
    description: "建议施用液体氮肥",
    thumbnail: BRAND_IMAGES.monsteraCloseup
  }
];

// 3. Complete Botanical Encyclopedia Database
export const ENCYCLOPEDIA_PLANTS: EncyclopediaPlant[] = [
  {
    id: "ep-1",
    name: "龟背竹",
    latinName: "Monstera deliciosa",
    category: "天南星科",
    lightRequirement: "diffuse",
    toxicity: "toxic",
    difficulty: "easy",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKpeyTKP0ctRicudRw03kYCBy_nK0nmAZabt8_PBQhT60VwEWVvAnOOx-VsYPYmzWWWJcBGIXZ_oXATcKdWJakhsQLZbYhcb9FpSytyRt7iNBjKxEsztyE-1BDzQpWUShB8VFoADPRs80RbnXNvJac6TdedAGt-RgxbU_Me56XYayQjcddK2mp06JCJPPcrhmTHYEhnZY6C2syVtQzze4ekier2mGNb7sS2gm-PBNY0aH5pRHircVrCQzX1Q2ibDLIyuNL3evZVQ",
    waterRequirement: "保持土壤微湿",
    description: "天南星科龟背竹属常绿木质藤本。叶大形，羽状深裂，质厚，生机勃勃。喜温暖潮湿环境，极具视觉冲击感。",
    careSecrets: "喜温暖潮湿，对光度要求中等。避免直射强光灼伤叶片，每月用稀释肥水追施一次。"
  },
  {
    id: "ep-2",
    name: "虎尾兰",
    latinName: "Sansevieria trifasciata",
    category: "天门冬科",
    lightRequirement: "low",
    toxicity: "safe",
    difficulty: "easy",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2qUCIlAV1OtgyY0Rvitf3RCKQZjLOw1e5LqajFK2XGkNXaJZ_PJbGG1wGbaaPD_EOzaTrAtk4SG9kvVA9J7pE2RZRJjYBciOdce_WbNSfJGy8WVpormYL_HOuL7Hb4zE-YWF0_XxtMkXZVHbPIIGfwWSsnv3Om6FBv-IvYuUV_uVZcg7sxgVUFXRZjTJUbFT0BAtN5pfultRwL_gh7fZPmDkAjh2n3Pf5RILzwrkmOtmzSdjaIEy4yaW-yQMlQ_fPBy8zgPunvw",
    waterRequirement: "耐旱，干透浇透",
    description: "百合科虎尾兰属多年生常绿草本。叶片直立坚挺，具白绿相间的横带斑纹。极耐阴旱，净化空气之王。",
    careSecrets: "极度耐旱，切忌盆土积水。冬季温度低于10度需断水，适合置于客厅半阴处净化空气。"
  },
  {
    id: "ep-3",
    name: "琴叶榕",
    latinName: "Ficus lyrata",
    category: "桑科",
    lightRequirement: "direct",
    toxicity: "toxic",
    difficulty: "medium",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoqSFcCZAV98t274qfMrv9l_sIR-sUYXWhoPGBd1PFMaPodrnmwTII1LwvdUK0TvkIOG3Y7Bl0tilp3HR9VuAK5Ob7IMpHRu_HCaVGvu1guxy6UFW1qSsvmcQ6HWsUQgZamcLdBODQXHgG83jxpzxlrEFUPUY4B_94bFAUunrX-zE8uFbghUugmCHnYUmL6Ek9kNiCLtk5zTDWRQplbZChF65KRuDL9Bfwg0ZaI3UuiifFjm6GgLAK_B0kOkuMXg8YyEdWcwRFLA",
    waterRequirement: "见干见湿，避免积水",
    description: "桑科榕属常绿乔木。叶片琴形，质硬挺拔，叶脉清晰，富有雕塑般的现代感。喜阳光充足与良好通风。",
    careSecrets: "对于琴叶榕，过早浇水与不透风容易引起根际真菌侵染并呈焦黑斑。推荐每周朝环境细雾喷淋，盆土见干见湿。"
  },
  {
    id: "ep-4",
    name: "金钱树",
    latinName: "Zamioculcas zamiifolia",
    category: "天南星科",
    lightRequirement: "low",
    toxicity: "toxic",
    difficulty: "easy",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtKIC9CXVqAdffnoDZIDtSAB_Nm7DWy82R8kALw8nfrsOLRpukiQnW1k35rB4toXBjjUCIe1blzEI6bORdAAU_6VJM4kLINMOKULn5z1Jc_eIjtxXxEUbYGMPL90QhMSCRWx0XVwTVyNZOFPO0WmXFLF86yX_K7GQ0E34IBiNiudZHzPY06k1KM1nerFvxx7FkTyTXr3kqHj-ylXafNT_Y6UmWqT7JkhlhWu1yo8dTO5cyJ7Jp0E6sV3SDX_QNLjsfuV_OATwO5g",
    waterRequirement: "干透浇透，极耐干旱",
    description: "地上无主茎，叶轴直立厚实，小叶对生厚实呈革质，泛出亮丽深绿。招财吉祥、低维护的首选室内植物。",
    careSecrets: "喜偏干性基质。过度多水易引起块茎腐烂，建议两周左右浇水一次，保持通风散光环境。"
  }
];

// 4. Social Community Posts
export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    title: undefined,
    content: "周末的阳光刚好，多肉们似乎又胖了一圈。记录一下这个美好的下午。🪴",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtKIC9CXVqAdffnoDZIDtSAB_Nm7DWy82R8kALw8nfrsOLRpukiQnW1k35rB4toXBjjUCIe1blzEI6bORdAAU_6VJM4kLINMOKULn5z1Jc_eIjtxXxEUbYGMPL90QhMSCRWx0XVwTVyNZOFPO0WmXFLF86yX_K7GQ0E34IBiNiudZHzPY06k1KM1nerFvxx7FkTyTXr3kqHj-ylXafNT_Y6UmWqT7JkhlhWu1yo8dTO5cyJ7Jp0E6sV3SDX_QNLjsfuV_OATwO5g",
    author: {
      name: "林间小鹿",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoud-nu574blFC1mHwwjImJX1cxz-YtqOyvyOCrCT8YDtRWcG0tvwG2GQgh8cLKWDKz4T80W7ezchEcJID6EzpNrrXBQTdSfcrN7GeFUzBwHV453Jp_AOV7znN8zbO6bHTw10yrzduZKpiHCuZMwISRRjs7tNVC50dplaE5rrAZd_zZsDT48g9aFtAfzjdBeJ4WAwgqbdf015pt6zjFoU03zq9TRnBjCi0-W9YW08qrfGHmPunb_G-4dRf1JCtctxUfQuR9m4kag",
      role: "多肉爱好者"
    },
    likes: 128,
    commentsCount: 24,
    tag: "我的室内花园"
  },
  {
    id: "post-2",
    title: "求助：龟背竹叶子发黄是怎么回事？",
    content: "最近刚买了一盆龟背竹，放在客厅角落，这几天发现下面的老叶子开始发黄了，是水浇多了还是缺光照？求大神指点！🙏",
    image: undefined,
    author: {
      name: "青青子衿",
      avatar: "",
      role: "新手养花人"
    },
    likes: 12,
    commentsCount: 45,
    tag: "新手求助"
  },
  {
    id: "post-3",
    title: undefined,
    content: "经过一个月的改造，我的“室内热带雨林”终于初具规模啦！每天下班回来看着它们，感觉所有的疲惫都消散了。",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI-4HmRW_b1Z5il_qjhWVH5-RNdZIkd0CuqZlfCSagD7i8P6w0WjTyuTHpxA2Wens3B_RunCnQvf4XEaS3hQVcGQ4HM9L2b8s69AYI4fCGIANd7XtNxzKq_W1UsVphkn7KIbJ9CzVhwyVcWS2qsR1D8uZUIZuKbh_Q1H9tQBNcaGKPNES3o0eLSZ-61TfP1augwOiZk_VhVaEGhSF06jgyzgDvFMvTg03se_YugTAgJwF4gj63hW2uL8hx8iIMkbwsVO-j2VsiwQ",
    author: {
      name: "Flora",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ-fVwNhrxyEzTxs24fL8HbLxAdDbPY7AN6vaUTJU6WoWKYECVfeTjOERBGDvfJHc0rPnoibeYow3fNXbZmuxHc9oFgwteb7JgsMcKthDu3tet31AgAOVM9NvKICGHqPzhEwpXbDMbyL46s1Te8itddYaRVPrCoBtZ3iJzXUdZT_H0E4CftiIDn2bSFFRhAgHUCVBwD_VlxloEpn43VJey1HVuKb0k3iYinh-ZQ7Fbxq-ebUITeSUanc4EV1K3UN0gEA6l0_SdXw",
      role: "造景大师"
    },
    likes: 342,
    commentsCount: 56,
    tag: "阳台改造"
  }
];

// 5. Landscaping Materials
export const LANDSCAPING_MATERIALS: LandscapingMaterial[] = [
  {
    id: "mat-1",
    name: "日本进口赤玉土",
    description: "稳定水质，透气保肥",
    price: 45,
    unit: "包",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATjUKAcdZkW4Kg4YjatQ5iFF9Eu2Oep_UpxpLCI536QcJC9Rkmg1c4TBCeAheFQ9Yt5LLN1t8sIls3hpkwiFOOu7xX-0os6vfrywY8G0old9oaNZVy_SqldhNPP-pVAZaqs2nFM1KNqfOCjXG1munhXuuJllNh_WHXKw1uTtWMrb9f5Y50I08RmU8awsH3aNapigHuivsdid0pbQNqOWyLfOl5Dy5F9j6baMxEvvL48wT_OQ0DMjwShVdioOUr58SF64bZETiabQ"
  },
  {
    id: "mat-2",
    name: "专业级造景镊子套装",
    description: "高碳钢材质，精密夹取",
    price: 128,
    unit: "套",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCDccneOFBg08fc4q6JAmWiVHETBa-Ne0_9lHjx2z6iCkRjIYiM1aYqiFIdqtoJnawJNWdFR-Jp6UkuvZqxLf_rc0Kg6AZsvxy_sIoV46_fQZL4SsPqPu0WU7zqhWlqsQogBn6gcq_SrV0goL9zbHBENpPCJjrX3yJCFqjSncDIm75_kOg3h70xuDTkbq-5J9BFXATh-RZmtKgW9HFbA-LH2sTgUP50LWceW9Uqra0DgVNpFcel9zrXd4-3SmzRils1xgEU9WldQ"
  },
  {
    id: "mat-3",
    name: "精选青龙石/造景骨架",
    description: "纹理奇特，营造山野感",
    price: 35,
    unit: "kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9jEyUokfpWOqmPJgYs43GjC9ORNjA5q9utIkMugzDckLn7hrC93rhXNJXfx2oDwwz1XhsJgyagGuJ5TqGnMFxBx-98o70XgCR_M56pvPqGxwxFEjszORKGRX1BdMytdzUCDV1tQVah2nM6dmr5Qzbf7nOln-F0hQV3BsJ7VAjEcxp8wcofr1gIr_Aadla8l3ego1UOznGlojM501GzGqEwRhzx3rbM38oIZy_49ToTFCZvF-gyDs9KSUgX5vFQXStWncMTVbTPQ"
  },
  {
    id: "mat-4",
    name: "智能微雨喷淋系统",
    description: "定时恒湿，静音运行",
    price: 299,
    unit: "套",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBog2qFNvuX4pKEwwFMoteFuMH0GnaVXCw_sf26W140VxotVXDEebrWw_34P307LKo1wkR7PmIu_kg71PXv-ofJZUDeLSLlyW9GBikvRT6F_wYRYJZNiz4NckJZVXrw4ke_oSKVcOTZMbTKU0YEIcPWMkwVRn7gqNIyHBLrP6AvH19LNFadgqafE5k-qywdake4T2rU4buYq_67kvWJ5o6_jwu3ODFSStBNcd9h7f8ODIZPNDoijN2EwHswflhpVhEfQGvkRu2Xew"
  }
];

// 6. Inspiration Gallery
export const INSPIRATIONS: InspirationItem[] = [
  {
    id: "insp-1",
    title: "微缩热带森林瓶",
    author: "@BotanicSoul",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU4o8eiOtGvMDxnqSuJKTjtLT7cq_nF8xgRxVUaVFKgCc1Skh8l-W8komsAApaj2lKlSyyv3NXfuyhM3SVTkeob1nVbVejmjiW8ldA3DqOiyoWdi9ZjfgMWL3G-et6dWFo-3_MED1ju9afXNXXA2cFez-nXrVJlK6hzbMxtAe-53Aag16gwqxoV7o8Xvj6Y9AjrhOXNmke-R8C3Egk2jvtzHg3iun6U5pv9HreqkUHCEK4C6AAIFhl0dQ3SuuldJyxf0pAfh2ygg"
  },
  {
    id: "insp-2",
    title: "草原的呼吸 - 水草溪流缸",
    author: "@Aquascape_Zen",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtTS72Tuh7U4v-a6mXBxgTkFFTGVzIGrQqeWAzUJdLyx5_woV2QKwt-RdWq3hP3Tf8mBWySVgQoSEY-K40w7xaGE2m7Wn2Vf7x2moNvt6Qo5129vSckCPX2bATR7UwkdiSVuTF-mdH9DeDLvXQBlfTW8nzV29hCS0wVcq4Fn4qPXljxIr1uik4t1cb4Y7zZxgLfpXie9f6NdhziiyT8Dheh6kxEPx6ccIlujpdE67FLXkZcBbAOn_2LoVaNzEnXlMRILRbZJ38FA"
  },
  {
    id: "insp-3",
    title: "荒野死寂 - 几何棱镜仙人掌",
    author: "@Desert_Architect",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8DyB9qIpBi74JIqAip1U3zMe5UR5a0xJEonp6C8LzbwjZFlJF1xGjIcgQA_jXAVcHl2pu0YRDe5-bf-jwqIFIO0smv6w66pJX3JFrhNv5JnM76UNr0leNpqvUXsleAZWKdkEjD2Se43TLI_VVowlTm5fTGDb5xKkohW3oxbacgvpr7mkSpGQdtSbLNCZeqItz158lGMoqHvNHHlRpyjAXfFduZxe1L_05U9Wc_hUEX05-O168piw83i76VyStmU8yJ42F6hyUfw"
  },
  {
    id: "insp-4",
    title: "波西米亚式生态隔屏",
    author: "@UrbanJungleDivider",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqaW-1vvgjImyJIvZF8ufxCbXrJloGCdTfgxN0ZKPsDrQ8tbLjGKcXOXYfhx5G1CHb0ky0h3rD2nISWsVOVO2Ku-eq7Jihm5TBkTdss2CMSghGNHEHNy3XiOZcaEbaL2AQdzlIrwjmEwrNyQLfQH4RPt20cfMd0ymjoWNS5ZwHl1ifUDPxPnz628zPvxRh_Ql7sxiWI2Gi_67vqFV9FLzISsZrzoW1_Snox5mzY4iJhqQXBOtcO-axqAc5pfPaKijhSChfUaJRlQ"
  },
  {
    id: "insp-5",
    title: "侘寂一隅 - 泥炭苔藓球",
    author: "@WabiSabiGreen",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQfen5kTdaOLci0DuzE5IMg_sHUdwKWUbkWvI5NEIu0ryaj--c-SY7YK2FkSahH_X9T04rou7lDwdpGc24-Iq6C2NMEeml_1fBdYJEQ3KrFXFEmIPp3jZCb2pyL4PeWULbYUMjWW3pNKYCNfQR2u_507zjQ5c0XJptYfRBi8s2FQKa_eqarnDZI-AOEI6RiRZFYpchHSQBHf0Ps68UlL2J9t-PA59ctvLFeLAD8CMCbGsjhw1jRgkr_AxcJA-10N05PxPMdQAK4g"
  }
];
