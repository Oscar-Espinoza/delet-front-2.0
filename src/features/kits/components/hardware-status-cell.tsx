import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { KitHardware } from '../types'

interface HardwareStatusCellProps {
  hardware: KitHardware[]
}

export function HardwareStatusCell({ hardware }: HardwareStatusCellProps) {
  const getHardwareByCategory = (category: string) => {
    return hardware.filter((hw) => hw.category === category)
  }

  const lock = getHardwareByCategory('lock')[0]
  const doorSensor = getHardwareByCategory('sensor')[0]
  const keypad = getHardwareByCategory('keypad')[0]
  const cameras = getHardwareByCategory('camera')
  const hub = getHardwareByCategory('hub')[0]
  const router = getHardwareByCategory('router')[0]

  const renderOperationalStatus = (
    status?: 'online' | 'offline',
    label?: string
  ) => {
    if (!status) {
      return (
        <Badge variant='outline' className='w-full border-gray-500 text-gray-500'>
          {label || 'Unknown'}
        </Badge>
      )
    }

    return (
      <Badge
        variant='outline'
        className={cn(
          'w-full',
          status === 'online' && 'border-green-500 text-green-500',
          status === 'offline' && 'border-red-500 text-red-500'
        )}
      >
        {label || status}
      </Badge>
    )
  }

  const renderLockStatus = () => {
    if (!lock) {
      return (
        <Badge variant='outline' className='w-full border-gray-500 text-gray-500'>
          N/A
        </Badge>
      )
    }

    const lockStatus = lock.lock?.status
    if (!lockStatus) {
      return (
        <Badge variant='outline' className='w-full border-gray-500 text-gray-500'>
          Unknown
        </Badge>
      )
    }

    return (
      <Badge
        variant='outline'
        className={cn(
          'w-full capitalize',
          lockStatus === 'locked' && 'border-green-500 text-green-500',
          lockStatus === 'unlocked' && 'border-orange-500 text-orange-500'
        )}
      >
        {lockStatus}
      </Badge>
    )
  }

  const renderSensorStatus = () => {
    if (!doorSensor) {
      return (
        <Badge variant='outline' className='w-full border-gray-500 text-gray-500'>
          Door: N/A
        </Badge>
      )
    }

    const sensorStatus = doorSensor.sensor?.status
    if (!sensorStatus) {
      return (
        <Badge variant='outline' className='w-full border-gray-500 text-gray-500'>
          Door: Unknown
        </Badge>
      )
    }

    return (
      <Badge
        variant='outline'
        className={cn(
          'w-full',
          sensorStatus === 'closed' && 'border-green-500 text-green-500',
          sensorStatus === 'open' && 'border-orange-500 text-orange-500'
        )}
      >
        Door {sensorStatus}
      </Badge>
    )
  }

  return (
    <div className='grid grid-cols-3 gap-4 2xl:w-1/2 w-full'>
      {renderLockStatus()}

      {renderSensorStatus()}

      {keypad && renderOperationalStatus(keypad.operationalStatus, 'Keypad')}

      {cameras.map((camera, index) => (
        <div key={camera._id} >
          {renderOperationalStatus(
            camera.operationalStatus,
            camera.camera?.name || camera.name || `Camera ${index + 1}`
          )}
        </div>
      ))}


      {hub && renderOperationalStatus(hub.operationalStatus, 'Hub')}
      {router && renderOperationalStatus(router.operationalStatus, 'Router')}

    </div>
  )
}