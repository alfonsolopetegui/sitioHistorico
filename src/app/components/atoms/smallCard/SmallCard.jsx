import styles from "./smallCard.module.css"
import Image from "next/image"

const SmallCard = ({data}) => {

  const image = data.imageUrl || '/placeholder-image.jpg';

  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <Image src={image} width={250} height={250}/>
      </div>
        <h1 className={styles.title}>{data.name}</h1>
    </div>
  )
}

export default SmallCard