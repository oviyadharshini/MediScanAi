@@ .. @@
               {result.image_info && (
                 <div className="image-details">
                   <small>
                    File: {result.image_info.filename} |{' '}
                    {result.image_info.size && (
                      <>Size: {result.image_info.size[0]}x{result.image_info.size[1]} |{' '}</>
                    )}
                     Format: {result.image_info.format}
                   </small>
                 </div>
               )}