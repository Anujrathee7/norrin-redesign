import { Photo } from '@/components/primitives/Photo'
import { photos } from '@/data/norrin'

/**
 * A quiet visual pause between the Gap presentation and the service detail.
 *
 * The causeway continues the page's pilot-to-production idea without adding
 * another block of copy or another interactive sequence. The frame stays
 * still while the photograph drifts slightly with scroll, using the same
 * motion treatment as the existing Careers image.
 */
export function PhotoInterlude() {
  const photo = photos.vision

  return (
    <section
      aria-label="From pilot to production"
      data-scene
      className="bg-ground py-5 md:py-7"
    >
      <div
        data-scene-part="uncover"
        data-scroll="photo-pan"
        style={{
          ['--scene-from' as string]: 'cover 4%',
          ['--scene-to' as string]: 'cover 68%',
        }}
        className="h-[42svh] min-h-80 overflow-clip md:h-[58svh] md:min-h-[480px]"
      >
        <Photo
          file={photo.file}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          sizes="100vw"
          frame={false}
          className="h-full w-full"
        />
      </div>
    </section>
  )
}
