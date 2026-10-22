'use client';

import React, { useState } from 'react';

/* Client-story carousel.

   Layout is the reference exactly: eyebrow and a glowing rule across the top
   left, arrows top right, a two-column split with the story on the left and a
   portrait card on the right, and a swoosh of orange light sweeping out of the
   bottom-left corner.

   Everything colour-wise comes off the same lights as the hero — amber core
   cooling into orange, white type going grey at the feet — so the section reads
   as the same page rather than as a pasted-in slide.

   The copy is the real client list. Three of the five have no card artwork
   yet, so those draw a panel with the brand name instead of borrowing another
   client's photograph — see the `image` field. */
interface Story {
  id: string;
  eyebrow: string;
  /* The brand name, split so the closing word can carry the orange. In the
     reference that accent falls on the ampersand; here it falls on the word
     that names the brand. A one-word name takes the accent whole. */
  titleLead: string;
  titleAccent: string;
  body: string;
  /* The brand's own colours, pulled off its poster: `a` is the flat colour the
     title's gradient sits on and the marker bar takes, `b` is the light end the
     ramp climbs to. Sampled from the artwork rather than invented, so the
     headline and the card read as one brand instead of the page's orange being
     stamped over five different identities. */
  accent: { a: string; b: string };
  /* The finished poster for this IP, from /assets/dfy-new/ips. These are
     designed artworks rather than photographs: type runs to all four edges, so
     the card shows each one WHOLE at its own aspect ratio and never crops to a
     fixed frame. Forcing them into the old 328/420 box cut the closing line off
     the bottom of two of them.

     Only one story is on screen at a time, so the artworks not sharing a single
     ratio costs nothing: Sonia's is 5:6 where the rest are 2:3, and the card
     simply sizes to whichever is showing.

     Undefined until the artwork exists. The card draws its own panel in the
     meantime rather than borrowing an unrelated client's photograph. */
  image?: string;
  caption: string;
}

const STORIES: Story[] = [
  {
    id: 'muscle-mehta',
    accent: { a: '#D08A00', b: '#FFD46B' }, // the gold of the Muscle Mehta lockup
    eyebrow: 'Built by TGO',
    titleLead: 'Muscle',
    titleAccent: 'Mehta',
    body: 'Hirav Mehta, fitness influencer with 2M loyal audience chose us to launch his mass premium digital coaching platform & brand — Muscle Mehta.',
    image: '/assets/dfy-new/ips/musclemehta.webp',
    caption: 'A 2M audience, turned into a premium coaching brand.',
  },
  {
    id: 'nume',
    accent: { a: '#0FA0AD', b: '#6FE3EA' }, // Numee teal
    eyebrow: 'Built by TGO',
    titleLead: '',
    titleAccent: 'Numee',
    body: 'FAB Bank, Middle East’s biggest bank chose us to launch their entire corporate wellness program for their 7500 workforce.',
    caption: 'Corporate wellness for a 7,500-strong workforce.',
    image: '/assets/dfy-new/ips/fab-bank.webp',
  },
  {
    id: 'fm4-therapy',
    accent: { a: '#1268C4', b: '#4FD8FF' }, // the FM4 cyan-into-blue
    eyebrow: 'Built by TGO',
    titleLead: 'FM4',
    titleAccent: 'Therapy',
    body: 'Sourobh Kulkorni, chose us to launch his flagship online program to help people reverse their knee, back & neck pain using his GOI patented ball therapy.',
    image: '/assets/dfy-new/ips/fm4-therapy.webp',
    caption: 'A patented ball therapy, taken online.',
  },
  {
    id: 'sonia-narang',
    accent: { a: '#C97A57', b: '#F5C7A6' }, // her rose gold
    eyebrow: 'Built by TGO',
    titleLead: 'Sonia',
    titleAccent: 'Narang',
    body: 'Sonia Narang, India’s #1 nutritionist with 2.4M followers partnered with us to launch her elite nutrition online business.',
    caption: 'India’s #1 nutritionist, now an online business.',
    image: '/assets/dfy-new/ips/sonia-narang.webp',
  },
  {
    id: 'finish-strong',
    accent: { a: '#D2201A', b: '#FF8A5C' }, // the Finish Strong red
    eyebrow: 'Built by TGO',
    titleLead: 'Finish Strong',
    titleAccent: 'Project',
    body: 'Satyam Sahai, 18x Ironman wanted to genuinely help everyday athletes crush Ironman Triathlon, and decided to partner with us to launch his one of its kind online program.',
    caption: '18x Ironman, coaching everyday athletes.',
    image: '/assets/dfy-new/ips/finish-strong-project.webp',
  },
];

/* The swooshes, expanded from their centrelines into closed ribbons.

   A stroke is one width for its whole run. These are not: the upper swoosh
   enters heavy and is drawn down to a hair as it leaves, while the lower one
   starts thin, swells through its middle and tapers out — so the pair never
   reads as one curve copied twice.

   The glow ribbons are deliberately lopsided. Roughly 86% of each one's width
   sits on the INNER side (below the upper swoosh, above the lower one) and the
   rest outside, so the light pools in the channel between them and the outer
   boundaries stay clean. Bloom on the outer side is what eats an edge; bloom on
   the inner side just makes the surface between them feel lit.

   Regenerate rather than hand-edit if the centrelines move. */
const A_CORE =
  'M-39.7 72.2 L-14.0 77.3 L11.4 82.5 L36.6 87.8 L61.7 93.2 L86.6 98.8 L111.2 104.5 L135.7 110.2 L160.1 116.1 L184.2 122.1 L208.2 128.2 L232.0 134.3 L255.6 140.5 L279.1 146.8 L302.4 153.2 L325.6 159.6 L348.6 166.0 L371.5 172.5 L394.2 179.1 L416.7 185.6 L439.2 192.2 L461.5 198.8 L483.6 205.5 L505.6 212.1 L527.5 218.8 L549.3 225.5 L570.9 232.1 L592.4 238.8 L613.8 245.4 L635.0 252.1 L656.2 258.7 L677.2 265.3 L698.1 271.8 L718.9 278.3 L739.6 284.8 L760.2 291.2 L775.6 295.6 L790.7 299.9 L805.6 304.1 L820.4 308.2 L835.0 312.1 L849.5 315.9 L863.8 319.6 L878.0 323.2 L892.1 326.7 L906.0 330.0 L919.9 333.3 L933.6 336.5 L947.2 339.5 L960.8 342.5 L974.2 345.4 L987.6 348.2 L1001.0 350.9 L1014.2 353.5 L1027.5 356.1 L1040.7 358.5 L1053.8 360.9 L1067.0 363.3 L1080.1 365.5 L1093.3 367.7 L1106.4 369.8 L1119.6 371.9 L1132.8 373.8 L1146.0 375.8 L1159.2 377.6 L1172.5 379.4 L1185.9 381.2 L1199.3 382.9 L1212.8 384.6 L1226.4 386.2 L1240.0 387.7 L1240.0 388.3 L1226.3 386.7 L1212.7 385.1 L1199.2 383.5 L1185.8 381.8 L1172.4 380.1 L1159.1 378.3 L1145.9 376.4 L1132.7 374.5 L1119.5 372.6 L1106.3 370.6 L1093.1 368.5 L1080.0 366.4 L1066.8 364.2 L1053.7 361.9 L1040.5 359.5 L1027.3 357.1 L1014.0 354.6 L1000.7 352.0 L987.4 349.3 L974.0 346.5 L960.5 343.6 L947.0 340.7 L933.3 337.6 L919.6 334.5 L905.7 331.2 L891.8 327.9 L877.7 324.4 L863.5 320.8 L849.2 317.2 L834.7 313.4 L820.1 309.5 L805.2 305.5 L790.3 301.4 L775.1 297.2 L759.8 292.8 L739.1 286.5 L718.4 280.1 L697.6 273.6 L676.6 267.2 L655.6 260.6 L634.4 254.1 L613.1 247.5 L591.7 240.9 L570.2 234.3 L548.6 227.7 L526.8 221.0 L504.9 214.4 L482.9 207.8 L460.8 201.2 L438.5 194.5 L416.1 188.0 L393.5 181.4 L370.8 175.0 L347.9 168.5 L324.9 162.1 L301.7 155.8 L278.4 149.5 L254.9 143.3 L231.3 137.2 L207.4 131.1 L183.5 125.1 L159.3 119.2 L135.0 113.4 L110.5 107.7 L85.8 102.1 L60.9 96.6 L35.9 91.2 L10.7 86.0 L-14.7 80.8 L-40.3 75.8 Z';
const A_GLOW =
  'M-39.4 71.0 L-13.8 76.0 L11.7 81.2 L36.9 86.5 L62.0 92.0 L86.8 97.5 L111.5 103.2 L136.0 109.0 L160.4 114.8 L184.5 120.8 L208.5 126.9 L232.3 133.0 L256.0 139.2 L279.5 145.5 L302.8 151.9 L325.9 158.3 L349.0 164.8 L371.8 171.3 L394.5 177.9 L417.1 184.5 L439.5 191.1 L461.8 197.7 L483.9 204.4 L505.9 211.1 L527.8 217.8 L549.6 224.5 L571.2 231.1 L592.7 237.8 L614.1 244.4 L635.3 251.1 L656.5 257.7 L677.5 264.2 L698.5 270.7 L719.3 277.2 L740.0 283.6 L760.6 290.0 L775.9 294.4 L791.0 298.7 L806.0 302.9 L820.8 306.9 L835.4 310.9 L849.8 314.7 L864.1 318.4 L878.3 322.0 L892.4 325.5 L906.3 328.9 L920.1 332.2 L933.8 335.4 L947.5 338.5 L961.0 341.5 L974.4 344.4 L987.8 347.2 L1001.1 350.0 L1014.4 352.6 L1027.6 355.2 L1040.8 357.7 L1054.0 360.1 L1067.1 362.5 L1080.3 364.7 L1093.4 366.9 L1106.5 369.0 L1119.7 371.1 L1132.9 373.1 L1146.1 375.0 L1159.3 376.9 L1172.6 378.7 L1186.0 380.5 L1199.4 382.2 L1212.9 383.9 L1226.4 385.5 L1240.1 387.0 L1239.3 394.0 L1225.6 392.4 L1212.0 390.9 L1198.5 389.3 L1185.0 387.7 L1171.6 386.0 L1158.3 384.4 L1145.0 382.6 L1131.7 380.9 L1118.5 379.1 L1105.2 377.3 L1092.0 375.4 L1078.8 373.4 L1065.6 371.4 L1052.3 369.4 L1039.1 367.2 L1025.8 365.0 L1012.4 362.7 L999.1 360.4 L985.6 357.9 L972.1 355.4 L958.5 352.8 L944.9 350.1 L931.1 347.2 L917.3 344.3 L903.3 341.3 L889.3 338.1 L875.1 334.9 L860.8 331.5 L846.4 328.0 L831.8 324.4 L817.1 320.6 L802.2 316.7 L787.1 312.7 L771.9 308.6 L756.5 304.2 L735.6 297.9 L714.8 291.5 L694.0 285.0 L673.1 278.5 L652.0 272.0 L630.8 265.5 L609.6 259.0 L588.1 252.5 L566.6 246.0 L544.9 239.5 L523.2 233.1 L501.2 226.6 L479.2 220.2 L457.0 213.9 L434.7 207.5 L412.2 201.2 L389.6 194.9 L366.9 188.7 L344.0 182.5 L320.9 176.4 L297.8 170.3 L274.4 164.3 L250.9 158.3 L227.3 152.4 L203.5 146.6 L179.6 140.8 L155.4 135.1 L131.2 129.5 L106.7 124.0 L82.1 118.5 L57.3 113.1 L32.4 107.9 L7.2 102.7 L-18.1 97.6 L-43.6 92.6 Z';
const A_BLOOM =
  'M-39.0 68.6 L-13.3 73.6 L12.2 78.8 L37.4 84.1 L62.5 89.6 L87.4 95.2 L112.1 100.8 L136.6 106.6 L160.9 112.5 L185.1 118.5 L209.1 124.6 L232.9 130.8 L256.6 137.0 L280.1 143.3 L303.4 149.7 L326.5 156.2 L349.6 162.7 L372.4 169.2 L395.1 175.8 L417.7 182.4 L440.1 189.1 L462.4 195.8 L484.5 202.4 L506.5 209.2 L528.4 215.9 L550.1 222.6 L571.8 229.3 L593.3 236.0 L614.6 242.6 L635.9 249.3 L657.0 255.9 L678.1 262.5 L699.0 269.0 L719.8 275.5 L740.5 282.0 L761.1 288.3 L776.4 292.7 L791.5 297.0 L806.4 301.1 L821.2 305.2 L835.8 309.1 L850.3 313.0 L864.6 316.7 L878.7 320.3 L892.8 323.8 L906.7 327.3 L920.5 330.6 L934.2 333.8 L947.8 336.9 L961.3 340.0 L974.7 342.9 L988.1 345.8 L1001.4 348.6 L1014.7 351.3 L1027.9 353.9 L1041.1 356.4 L1054.2 358.9 L1067.3 361.2 L1080.5 363.5 L1093.6 365.8 L1106.7 367.9 L1119.9 370.0 L1133.0 372.0 L1146.2 374.0 L1159.5 375.9 L1172.7 377.7 L1186.1 379.5 L1199.5 381.2 L1213.0 382.9 L1226.6 384.5 L1240.2 386.1 L1238.4 402.0 L1224.7 400.5 L1211.1 398.9 L1197.5 397.4 L1184.0 396.0 L1170.5 394.5 L1157.1 393.0 L1143.7 391.5 L1130.4 390.0 L1117.1 388.4 L1103.7 386.9 L1090.4 385.3 L1077.1 383.6 L1063.8 381.9 L1050.4 380.2 L1037.1 378.3 L1023.6 376.4 L1010.2 374.5 L996.7 372.4 L983.1 370.3 L969.4 368.1 L955.7 365.8 L941.9 363.3 L928.1 360.8 L914.1 358.1 L900.0 355.3 L885.8 352.4 L871.5 349.3 L857.1 346.1 L842.5 342.7 L827.9 339.2 L813.0 335.5 L798.1 331.7 L782.9 327.7 L767.6 323.4 L752.2 319.1 L731.0 312.6 L710.3 306.2 L689.4 299.9 L668.4 293.5 L647.3 287.2 L626.1 280.9 L604.7 274.6 L583.2 268.3 L561.7 262.1 L540.0 255.8 L518.1 249.6 L496.2 243.4 L474.1 237.3 L451.8 231.1 L429.5 225.1 L407.0 219.0 L384.4 213.0 L361.6 207.0 L338.8 201.1 L315.7 195.2 L292.6 189.3 L269.3 183.6 L245.8 177.8 L222.2 172.1 L198.5 166.5 L174.6 160.9 L150.5 155.4 L126.3 150.0 L101.9 144.6 L77.4 139.3 L52.7 134.0 L27.9 128.8 L2.9 123.7 L-22.3 118.7 L-47.7 113.7 Z';
const B_CORE =
  'M-39.9 185.6 L-14.3 191.7 L11.2 197.9 L36.4 204.0 L61.4 210.1 L86.3 216.2 L111.0 222.3 L135.5 228.3 L159.9 234.3 L184.0 240.3 L208.0 246.2 L231.8 252.1 L255.5 258.0 L279.0 263.8 L302.3 269.6 L325.5 275.3 L348.5 281.0 L371.4 286.6 L394.1 292.1 L416.7 297.6 L439.1 303.0 L461.4 308.4 L483.5 313.7 L505.6 318.9 L527.4 324.0 L549.2 329.0 L570.8 333.9 L592.3 338.7 L613.7 343.4 L634.9 348.0 L656.1 352.5 L677.1 356.9 L698.0 361.2 L718.8 365.3 L739.5 369.3 L760.1 373.2 L775.4 375.2 L790.6 377.1 L805.5 379.0 L820.3 380.8 L835.0 382.5 L849.4 384.1 L863.8 385.6 L877.9 387.0 L892.0 388.4 L906.0 389.7 L919.8 390.9 L933.5 392.0 L947.1 393.1 L960.7 394.1 L974.2 395.1 L987.6 395.9 L1000.9 396.7 L1014.2 397.5 L1027.4 398.2 L1040.6 398.8 L1053.8 399.4 L1066.9 399.9 L1080.1 400.3 L1093.2 400.7 L1106.4 401.1 L1119.5 401.3 L1132.7 401.6 L1145.9 401.7 L1159.2 401.9 L1172.5 402.0 L1185.8 402.0 L1199.3 402.0 L1212.8 401.9 L1226.3 401.8 L1240.0 401.7 L1240.0 402.3 L1226.3 402.5 L1212.8 402.6 L1199.3 402.7 L1185.8 402.7 L1172.5 402.7 L1159.2 402.7 L1145.9 402.6 L1132.7 402.4 L1119.5 402.2 L1106.3 402.0 L1093.2 401.7 L1080.0 401.3 L1066.9 400.9 L1053.7 400.5 L1040.6 399.9 L1027.3 399.4 L1014.1 398.7 L1000.8 398.0 L987.5 397.2 L974.1 396.4 L960.6 395.5 L947.0 394.5 L933.4 393.5 L919.7 392.3 L905.8 391.1 L891.9 389.9 L877.8 388.5 L863.6 387.1 L849.3 385.6 L834.8 384.0 L820.1 382.3 L805.3 380.6 L790.4 378.7 L775.2 376.8 L759.9 374.8 L739.2 371.0 L718.5 367.1 L697.6 363.0 L676.7 358.8 L655.7 354.5 L634.5 350.1 L613.2 345.5 L591.8 340.8 L570.3 336.1 L548.7 331.2 L526.9 326.2 L505.0 321.1 L483.0 316.0 L460.8 310.7 L438.6 305.4 L416.1 299.9 L393.6 294.4 L370.8 288.8 L348.0 283.2 L325.0 277.4 L301.8 271.6 L278.5 265.8 L255.0 259.8 L231.4 253.9 L207.6 247.9 L183.6 241.8 L159.5 235.7 L135.2 229.6 L110.7 223.5 L86.0 217.3 L61.2 211.2 L36.2 205.0 L10.9 198.8 L-14.5 192.6 L-40.1 186.4 Z';
const B_GLOW =
  'M-38.0 177.6 L-12.4 183.8 L13.1 189.9 L38.4 195.9 L63.5 201.9 L88.4 207.9 L113.1 213.8 L137.7 219.6 L162.1 225.4 L186.3 231.2 L210.4 236.9 L234.2 242.6 L258.0 248.2 L281.5 253.7 L304.9 259.2 L328.1 264.7 L351.2 270.1 L374.1 275.5 L396.9 280.8 L419.5 286.1 L442.0 291.3 L464.3 296.4 L486.4 301.6 L508.4 306.7 L530.3 311.7 L552.0 316.7 L573.6 321.6 L595.0 326.4 L616.3 331.2 L637.5 335.8 L658.6 340.4 L679.6 344.8 L700.4 349.2 L721.1 353.5 L741.8 357.6 L761.7 361.5 L776.9 363.7 L792.0 365.9 L806.9 367.9 L821.6 369.9 L836.1 371.8 L850.5 373.7 L864.8 375.5 L878.9 377.2 L892.9 378.8 L906.8 380.3 L920.6 381.8 L934.2 383.2 L947.8 384.6 L961.3 385.9 L974.7 387.1 L988.0 388.2 L1001.3 389.3 L1014.5 390.3 L1027.7 391.2 L1040.9 392.0 L1054.0 392.8 L1067.2 393.5 L1080.3 394.2 L1093.4 394.8 L1106.5 395.3 L1119.6 395.8 L1132.8 396.1 L1146.0 396.5 L1159.2 396.7 L1172.5 396.9 L1185.8 397.0 L1199.2 397.1 L1212.7 397.1 L1226.3 397.0 L1239.9 396.8 L1240.0 402.8 L1226.3 403.0 L1212.8 403.1 L1199.3 403.2 L1185.8 403.2 L1172.5 403.2 L1159.2 403.2 L1145.9 403.1 L1132.7 403.0 L1119.5 402.8 L1106.3 402.5 L1093.2 402.3 L1080.0 401.9 L1066.9 401.5 L1053.7 401.1 L1040.5 400.6 L1027.3 400.0 L1014.1 399.4 L1000.8 398.7 L987.4 398.0 L974.0 397.1 L960.5 396.3 L947.0 395.3 L933.3 394.3 L919.6 393.2 L905.7 392.0 L891.8 390.8 L877.7 389.5 L863.5 388.1 L849.2 386.6 L834.7 385.1 L820.0 383.4 L805.2 381.7 L790.2 379.9 L775.1 378.0 L759.7 376.0 L739.0 372.2 L718.3 368.3 L697.4 364.2 L676.5 360.0 L655.4 355.6 L634.2 351.2 L613.0 346.6 L591.6 341.9 L570.1 337.2 L548.4 332.3 L526.7 327.3 L504.8 322.2 L482.8 317.0 L460.6 311.7 L438.3 306.3 L415.9 300.8 L393.3 295.3 L370.6 289.7 L347.8 284.0 L324.8 278.3 L301.6 272.5 L278.3 266.6 L254.8 260.7 L231.2 254.7 L207.4 248.7 L183.4 242.7 L159.3 236.6 L135.0 230.5 L110.5 224.4 L85.8 218.2 L61.0 212.1 L35.9 205.9 L10.7 199.7 L-14.7 193.5 L-40.3 187.4 Z';
const B_BLOOM =
  'M-35.5 167.2 L-9.8 173.3 L15.7 179.4 L41.0 185.4 L66.1 191.3 L91.0 197.1 L115.8 202.9 L140.4 208.6 L164.9 214.2 L189.2 219.8 L213.3 225.3 L237.2 230.7 L261.0 236.1 L284.6 241.4 L308.0 246.7 L331.3 251.9 L354.4 257.1 L377.4 262.2 L400.2 267.2 L422.9 272.2 L445.4 277.2 L467.7 282.1 L489.9 286.9 L511.9 291.7 L533.8 296.5 L555.5 301.2 L577.1 305.9 L598.5 310.6 L619.8 315.2 L640.9 319.8 L662.0 324.3 L682.8 328.8 L703.6 333.2 L724.2 337.5 L744.8 341.7 L763.8 345.6 L779.0 348.0 L793.9 350.3 L808.7 352.6 L823.4 354.8 L837.8 356.9 L852.1 359.1 L866.3 361.1 L880.3 363.1 L894.2 365.0 L908.0 366.9 L921.7 368.7 L935.2 370.4 L948.7 372.1 L962.1 373.7 L975.5 375.3 L988.7 376.8 L1001.9 378.2 L1015.1 379.5 L1028.2 380.8 L1041.3 381.9 L1054.4 383.0 L1067.5 384.1 L1080.5 385.0 L1093.6 385.9 L1106.7 386.7 L1119.8 387.4 L1132.9 388.0 L1146.1 388.5 L1159.3 389.0 L1172.5 389.3 L1185.8 389.6 L1199.2 389.8 L1212.7 389.8 L1226.2 389.8 L1239.8 389.7 L1240.0 403.7 L1226.3 403.8 L1212.8 404.0 L1199.3 404.0 L1185.8 404.1 L1172.5 404.1 L1159.2 404.1 L1145.9 404.0 L1132.7 403.9 L1119.5 403.7 L1106.3 403.5 L1093.2 403.3 L1080.0 403.0 L1066.8 402.6 L1053.7 402.2 L1040.5 401.8 L1027.3 401.2 L1014.0 400.6 L1000.7 400.0 L987.3 399.3 L973.9 398.5 L960.4 397.7 L946.9 396.8 L933.2 395.8 L919.5 394.7 L905.6 393.6 L891.6 392.4 L877.5 391.1 L863.3 389.8 L849.0 388.3 L834.5 386.8 L819.8 385.2 L805.0 383.5 L790.0 381.7 L774.8 379.8 L759.5 377.9 L738.6 374.0 L717.9 370.1 L697.0 366.0 L676.1 361.8 L655.0 357.5 L633.9 353.0 L612.6 348.5 L591.2 343.8 L569.7 338.9 L548.0 334.0 L526.3 329.0 L504.4 323.9 L482.4 318.6 L460.2 313.3 L437.9 307.9 L415.5 302.4 L393.0 296.8 L370.3 291.2 L347.4 285.5 L324.4 279.7 L301.3 273.9 L278.0 268.0 L254.5 262.0 L230.9 256.1 L207.1 250.0 L183.1 244.0 L159.0 237.9 L134.7 231.8 L110.2 225.6 L85.5 219.5 L60.7 213.3 L35.6 207.1 L10.4 200.9 L-15.0 194.7 L-40.6 188.6 Z';

const Arrow = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {direction === 'left' ? (
      <>
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </>
    ) : (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    )}
  </svg>
);

export default function ClientStories() {
  const [index, setIndex] = useState(0);
  const story = STORIES[index] ?? STORIES[0];
  if (!story) return null;

  const step = (delta: number) =>
    setIndex((i) => (i + delta + STORIES.length) % STORIES.length);

  return (
    <section
      className="relative bg-black pb-28 pt-14 md:pb-40 md:pt-20"
      style={
        {
          '--ip-a': story.accent.a,
          '--ip-b': story.accent.b,
        } as React.CSSProperties
      }
    >
      {/* Two swooshes, running out of this section and into the next one.

          The box starts a little past this section's midpoint and ends well
          below its foot, and that overhang is the whole point: both curves rise
          to the right and leave through the right edge, so pushing the box down
          is what lands their tails in the TOP RIGHT of the section below rather
          than terminating them inside this one. The wave reads as one movement
          crossing a boundary instead of as decoration that stops at it.

          That only works because the next section no longer paints its own
          black. It used to, which covered the overhang completely: the spill
          was there the whole time and simply could not be seen. Both sections
          now sit inside one black wrapper in page.tsx, and the next one is
          transparent over it. It still paints ABOVE these curves, since it
          comes later in the DOM and is positioned, so its content stays clear
          of the light with no z-index needed.

          Neither curve is cut at the boundary, so there is no seam to hide.

          preserveAspectRatio="none" so they span the full viewport width
          instead of the box cropping them. The box being anchored to a
          percentage at the top and a fixed overhang at the foot means the rake
          shifts a little with section height; the crossing holds either way.

          That same preserveAspectRatio is why the box is sized completely
          differently below md. With no aspect ratio kept, the rake is set by
          how the 1200x560 viewBox is squeezed into the box: divide the box's
          height share by its width share and desktop lands near 1.0, which is
          the shallow angle these curves were drawn at. A phone keeps the same
          box height against a third of the width, which puts that figure near
          4 and turns a slow rise into a hard diagonal across the screen.

          So on mobile the box stops tracking the section's height and becomes a
          fixed 200px band pinned to the foot. 200px against a ~390px viewport
          returns the ratio to about 1.1, and the tails still clear the boundary
          by roughly 30px. */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-[-90px] z-0 h-[200px] w-full md:bottom-[-220px] md:top-[55%] md:h-auto"
        viewBox="0 0 1200 560"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* The swoosh runs on the IP's colour, not the page's orange. Same
              shape as before: dark at both ends, opening through the brand
              colour and peaking on its light end around three quarters across,
              which is where the curve is heaviest.

              Opacity does the fading, colour does the identity. Fading with
              colour instead would drag every brand towards the same washed
              value at the ends and lose the thing that makes them distinct.

              The stops carry a transition so a slide change moves the light
              across rather than cutting it. */}
          <linearGradient id="dfy-swoosh" x1="0" y1="0" x2="1" y2="0">
            <stop
              className="dfy-swoosh-stop"
              offset="0%"
              stopColor="var(--ip-a)"
              stopOpacity="0.25"
            />
            <stop
              className="dfy-swoosh-stop"
              offset="22%"
              stopColor="var(--ip-a)"
              stopOpacity="0.9"
            />
            <stop
              className="dfy-swoosh-stop"
              offset="55%"
              stopColor="var(--ip-a)"
              stopOpacity="1"
            />
            <stop
              className="dfy-swoosh-stop"
              offset="76%"
              stopColor="var(--ip-b)"
              stopOpacity="1"
            />
            <stop
              className="dfy-swoosh-stop"
              offset="92%"
              stopColor="var(--ip-a)"
              stopOpacity="0.65"
            />
            <stop
              className="dfy-swoosh-stop"
              offset="100%"
              stopColor="var(--ip-a)"
              stopOpacity="0"
            />
          </linearGradient>
          <filter
            id="dfy-swoosh-blur"
            x="-20%"
            y="-40%"
            width="140%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>
          {/* The wide, faint pass. Without it the hairline has nothing around
              it and the colour reads as flat and washed however saturated the
              gradient is — glow is what makes orange look hot. */}
          <filter
            id="dfy-swoosh-bloom"
            x="-25%"
            y="-90%"
            width="150%"
            height="280%"
          >
            <feGaussianBlur stdDeviation="26" />
          </filter>
          {/* barely a blur: on a hairline this is the difference between a
              drawn line and a lit one, and any more of it reads as a smudge */}
          <filter
            id="dfy-swoosh-core"
            x="-20%"
            y="-40%"
            width="140%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {/* upper swoosh */}
        <path
          d={A_BLOOM}
          fill="url(#dfy-swoosh)"
          opacity="0.42"
          filter="url(#dfy-swoosh-bloom)"
        />
        <path
          d={A_GLOW}
          fill="url(#dfy-swoosh)"
          opacity="0.9"
          filter="url(#dfy-swoosh-blur)"
        />
        <path
          d={A_CORE}
          fill="url(#dfy-swoosh)"
          filter="url(#dfy-swoosh-core)"
        />

        {/* Lower swoosh: a wide gap at the left edge closing to almost nothing
            on the right. The convergence is the point — parallel lines read as
            two strokes, a closing gap reads as a surface turning away. */}
        <path
          d={B_BLOOM}
          fill="url(#dfy-swoosh)"
          opacity="0.28"
          filter="url(#dfy-swoosh-bloom)"
        />
        <path
          d={B_GLOW}
          fill="url(#dfy-swoosh)"
          opacity="0.7"
          filter="url(#dfy-swoosh-blur)"
        />
        <path
          d={B_CORE}
          fill="url(#dfy-swoosh)"
          opacity="0.92"
          filter="url(#dfy-swoosh-core)"
        />
      </svg>

      {/* dfy-story-clock scopes the hover pause: anywhere in the story block,
          not just over the 1px rule itself. */}
      <div className="dfy-story-clock relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        {/* Top rail: label, its rule, and the arrows sharing one baseline. */}
        <div
          data-reveal
          className="mb-10 flex items-center gap-5 md:mb-14 md:gap-8"
        >
          <p className="dfy-press-label shrink-0 text-[11px] font-semibold uppercase tracking-[0.32em] md:text-sm">
            {story.eyebrow}
          </p>
          {/* The rule doubles as the progress clock. `key` is the story id, so
              React remounts the fill on every change and the animation restarts
              from zero: on the auto-advance, and on an arrow press too, which is
              what stops a manual jump from inheriting the last slide's
              remaining time. */}
          <span className="dfy-story-rule" aria-hidden="true">
            <span
              key={story.id}
              className="dfy-story-rule-fill"
              onAnimationEnd={() => step(1)}
            />
          </span>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous story"
              className="dfy-story-nav"
            >
              <Arrow direction="left" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next story"
              className="dfy-story-nav"
            >
              <Arrow direction="right" />
            </button>
          </div>
        </div>

        {/* The grid reveals, not the slide inside it: the story swaps on every
            step, and a card that fades in each time reads as a page reloading
            rather than as a carousel advancing. */}
        <div
          data-reveal
          style={{ '--i': 1 } as React.CSSProperties}
          className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,330px)] md:gap-14"
        >
          {/* Left: the story. */}
          <div>
            <h2 className="font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[9vw] font-bold leading-[1.05] md:text-[58px]">
              {story.titleLead ? (
                <span className="dfy-title-white">{story.titleLead} </span>
              ) : null}
              <span className="dfy-title-ip">{story.titleAccent}</span>
            </h2>

            {/* The short bar under the title, the one piece of flat colour in
                the section: it is a marker, not a light. It takes the IP's own
                colour so the bar and the word stay one lockup. */}
            <span
              className="dfy-story-bar mb-7 mt-6 block h-[3px] w-[104px] md:mb-9 md:mt-7"
              aria-hidden="true"
            />

            <p className="max-w-[34rem] text-[15px] leading-[1.65] text-[#C9CFDA] md:text-lg md:leading-[1.7]">
              {story.body}
            </p>
          </div>

          {/* Right: the card. The artwork carries the whole message, so there
              is nothing under it — a caption here only repeats what the poster
              already says. */}
          <figure className="dfy-story-card mx-auto w-full max-w-[330px]">
            <div className="dfy-story-art overflow-hidden rounded-[18px]">
              {story.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={story.image} alt={story.caption} className="w-full" />
              ) : (
                <div className="flex aspect-[328/420] w-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <span className="dfy-title-orange text-2xl font-bold">
                    {`${story.titleLead} ${story.titleAccent}`.trim()}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/30">
                    Artwork to come
                  </span>
                </div>
              )}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
