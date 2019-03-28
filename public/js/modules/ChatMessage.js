export default {
    props: ['msg'],
    
    template:  `
      <p class="new-message" :class="{ 'my-message' : matchID }">
      <span>{{msg.message.name}} says:</span>
      {{msg.message.content}}
      </p>
    `,
    
    data: function() {
        return {
           
          matchID: this.$parent.socketID == this.msg.id  
       }
    }
}