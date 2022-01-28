
// TODO must be capitalize
import Image from './Image.vue';

export default {
  component: Image,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: 'Iberpay/Image',
 
};

export const actionsData = {
 
};

const Template = args => ({
  components: { Image },
  setup() {
    return { args, ...actionsData };
  },
  template: '<Image v-bind="args" />',
});
export const Default = Template.bind({});
Default.args = {

};
