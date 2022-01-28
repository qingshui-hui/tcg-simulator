import { shallowMount, mount } from '@vue/test-utils'
import { MarkTool } from '..'

let wrapper

describe('MarkTool', () => {
  beforeEach(() => {
    wrapper = shallowMount(MarkTool)
  })

  it('is called', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
