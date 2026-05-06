import React from 'react'

export function lazy(factory) {
  const Component = React.lazy(factory)
  Component.preload = factory
  return Component
}
