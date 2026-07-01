# Team Photos — Upload Guide

Drop each team member's photo into this folder following the spec below.
The site automatically uses the photo or falls back to initials if the file is missing.

---

## Naming Convention

`firstname-lastname.jpg`

- All **lowercase**
- Words separated by **hyphens** (no spaces, no underscores)
- Drop salutations (Mr. / Mrs. / Ms.)
- Use full name including middle name when part of the official name

| Team Member                  | Filename                       |
|------------------------------|--------------------------------|
| Mehul Rajesh Nagar           | `mehul-rajesh-nagar.jpg`       |
| Anand Singh Rajput           | `anand-singh-rajput.jpg`       |
| Kavita Jukunte               | `kavita-jukunte.jpg`           |
| Shailendra Jadhav            | `shailendra-jadhav.jpg`        |
| Parth Parmar                 | `parth-parmar.jpg`             |
| Atharva Chavan               | `atharva-chavan.jpg`           |
| Vanshika Pakhare             | `vanshika-pakhare.jpg`         |
| Manish Satam                 | `manish-satam.jpg`             |
| Nitin Chavan                 | `nitin-chavan.jpg`             |
| Ranvijay Singh               | `ranvijay-singh.jpg`           |
| Omkar Santosh Nikam          | `omkar-santosh-nikam.jpg`      |
| Akshada Pawar                | `akshada-pawar.jpg`            |
| Supriya Joshi                | `supriya-joshi.jpg`            |
| Sanjay Kumar Ram             | `sanjay-kumar-ram.jpg`         |
| Priyanka Palav               | `priyanka-palav.jpg`           |
| Jyotsna Patil                | `jyotsna-patil.jpg`            |
| Dhiraj Bane                  | `dhiraj-bane.jpg`              |
| Shrudi Pullani               | `shrudi-pullani.jpg`           |
| Riya Kamble                  | `riya-kamble.jpg`              |
| Sejal Dalvi                  | `sejal-dalvi.jpg`              |
| Kaushiki Singh               | `kaushiki-singh.jpg`           |
| Nitin Ghanekar               | `nitin-ghanekar.jpg`           |
| Sandeep Jadhav               | `sandeep-jadhav.jpg`           |

---

## Image Spec

| Property        | Requirement                                  |
|-----------------|----------------------------------------------|
| **Format**      | JPEG (`.jpg`) — best quality-to-size ratio   |
| **Aspect ratio**| **1:1 (square)** — mandatory                 |
| **Dimensions**  | **600 × 600 px** minimum (800 × 800 px ideal)|
| **File size**   | Keep under **200 KB** per photo              |
| **Quality**     | Export at **85%** JPEG quality               |

### Why 1:1 and 600 × 600?

The component renders photos inside a **circular frame** (112 px on mobile, 128 px on desktop).
Next.js Image optimises and crops the source automatically, so:

- A square crop means nothing important is cut off by the circular mask.
- 600 px source looks sharp on 2× Retina / HiDPI screens (128 × 2 = 256 px needed, 600 px gives headroom).
- 800 px is the sweet spot for 3× mobile screens (e.g. iPhone 15 Pro).

### Framing advice

- **Face centred** in the frame
- Face + shoulders occupy the **top 70 %** of the image; leave ~30 % below the chin as breathing room
- Solid or blurred background preferred (consistent look across the grid)
- Good, even lighting — avoid harsh shadows on the face

---

*After uploading, no code changes are needed — `data/team.json` already maps each member to their file.*
